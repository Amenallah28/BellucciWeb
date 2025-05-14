from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth
from functools import wraps
from firebase_admin import auth
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

# Connect to local MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["bellucci_db"]

# Initialize Flask
app = Flask(__name__)
CORS(app)  # Enable CORS

# Initialize Firebase
cred = credentials.Certificate("firebase-creds.json")
firebase_admin.initialize_app(cred)


def verify_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'No token provided'}), 401
           
        try:
            # Remove 'Bearer ' prefix if present
            token = auth_header.replace('Bearer ', '')
            decoded_token = auth.verify_id_token(token)
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': str(e)}), 401
    return decorated_function

@app.route('/api/profile')
@verify_token
def profile():
    print("\n=== New Request ===")
    print("Headers:", request.headers)
    print("Authorization Header:", request.headers.get("Authorization"))
    
    token = request.headers.get("Authorization")
    if not token:
        print("Error: No token provided")
        return jsonify({"error": "Token missing!"}), 401
    
    try:
        print("Raw token:", token)
        token = token.replace("Bearer ", "").strip()
        token = token.split()[0]  # Takes first segment if multiple exist
        print("Cleaned token:", token)
        
        decoded = auth.verify_id_token(token)
        print("Decoded token:", decoded)
        
        return jsonify({
            "user_id": decoded["uid"],
            "email": decoded.get("email", ""),
            "message": "Authentication successful!"
        })
        
    except Exception as e:
        print("Token verification failed:", str(e))
        print(f"Token length: {len(token)} | Last 5 chars: {token[-5:]}")
        return jsonify({"error": str(e)}), 401
    
@app.route('/api/users', methods=['POST'])
@verify_token
def create_or_update_user():
    data = request.json
    firebase_uid = data.get('firebase_uid')
    email = data.get('email')
    preferences = data.get('preferences', {})
    role = data.get('role')  # No default!

    # Seller-specific fields
    business_name = data.get('business_name')
    description = data.get('description')
    phone = data.get('phone')

    # Buyer fields
    first_name = data.get('first_name')
    last_name = data.get('last_name')

    if not firebase_uid or not email:
        return jsonify({'error': 'Missing firebase_uid or email'}), 400

    user_doc = {
        "firebase_uid": firebase_uid,
        "email": email,
        "preferences": preferences,
        "updated_at": datetime.utcnow()
    }

    if role:
        user_doc["role"] = role
    if role == "seller":
        user_doc["business_name"] = business_name
        user_doc["description"] = description
        user_doc["phone"] = phone

    # Add buyer fields if present
    if first_name:
        user_doc["first_name"] = first_name
    if last_name:
        user_doc["last_name"] = last_name

    db["users"].update_one(
        {"firebase_uid": firebase_uid},
        {"$set": user_doc, "$setOnInsert": {"created_at": datetime.utcnow()}},
        upsert=True
    )

    return jsonify({'message': 'User profile saved!'}), 201
    
@app.route('/api/user/me', methods=['GET'])
@verify_token
def get_my_user():
    print("GET /api/user/me called")
    try:
        auth_header = request.headers.get('Authorization')
        print("Authorization header:", auth_header)
        token = auth_header.replace('Bearer ', '')
        decoded = auth.verify_id_token(token)
        print("Decoded token:", decoded)
        firebase_uid = decoded['uid']

        user = db["users"].find_one({"firebase_uid": firebase_uid})
        if not user:
            print("User not found")
            return jsonify({"error": "User not found"}), 404

        user["_id"] = str(user["_id"])  # Convert ObjectId to string
        print("User found:", user)
        return jsonify(user)
    except Exception as e:
        print("Error in /api/user/me:", str(e))
        return jsonify({"error": str(e)}), 400
    


@app.route('/api/user/me', methods=['PUT'])
@verify_token
def update_my_user():
    try:
        auth_header = request.headers.get('Authorization')
        token = auth_header.replace('Bearer ', '')
        decoded = auth.verify_id_token(token)
        firebase_uid = decoded['uid']

        data = request.json
        # Only allow updating certain fields
        allowed_fields = [
            "email", "preferences", "business_name", "description", "phone", "role", "first_name", "last_name"
        ]
        update_fields = {k: v for k, v in data.items() if k in allowed_fields}

        if not update_fields:
            return jsonify({"error": "No valid fields to update"}), 400

        update_fields["updated_at"] = datetime.utcnow()

        result = db["users"].update_one(
            {"firebase_uid": firebase_uid},
            {"$set": update_fields}
        )

        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404

        # Return updated user
        user = db["users"].find_one({"firebase_uid": firebase_uid})
        user["_id"] = str(user["_id"])
        return jsonify(user), 200

    except Exception as e:
        print("Error in PUT /api/user/me:", str(e))
        return jsonify({"error": str(e)}), 400


@app.route('/api/interactions', methods=['POST'])
@verify_token
def record_interaction():
    try:
        # Get user ID from token
        auth_header = request.headers.get('Authorization')
        token = auth_header.replace('Bearer ', '')
        decoded = auth.verify_id_token(token)
        user_id = decoded['uid']

        data = request.json
        item_id = data.get('item_id')
        interaction_type = data.get('interaction_type')  # 'like', 'dislike', 'save', 'purchase'

        if not all([item_id, interaction_type]):
            return jsonify({'error': 'Missing required fields (item_id, interaction_type)'}), 400

        # Validate interaction type
        if interaction_type not in ['like', 'dislike', 'save', 'purchase']:
            return jsonify({'error': 'Invalid interaction_type'}), 400

        interaction = {
            "user_id": user_id,
            "item_id": item_id,
            "interaction_type": interaction_type,
            "created_at": datetime.utcnow()
        }
        print(f"[INTERACTION] User: {user_id} | Item: {item_id} | Type: {interaction_type}")
        db["user_interactions"].insert_one(interaction)
        return jsonify({'message': 'Interaction recorded!'}), 201

    except Exception as e:
        print(f"Error in /api/interactions: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/cart/add', methods=['POST'])
@verify_token
def add_to_cart():
    try:
        # Get user ID from token
        auth_header = request.headers.get('Authorization')
        token = auth_header.replace('Bearer ', '')
        decoded = auth.verify_id_token(token)
        firebase_uid = decoded['uid']

        data = request.json
        item_id = data.get('item_id')

        if not item_id:
            return jsonify({'error': 'Missing item_id'}), 400

        # Validate item exists
        item = db["clothing_items"].find_one({"id": item_id})
        if not item:
            return jsonify({'error': 'Item not found'}), 404

        # Add to cart
        result = db["users"].update_one(
            {"firebase_uid": firebase_uid},
            {
                "$addToSet": {"cart": item_id},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )

        # Record purchase interaction
        db["user_interactions"].insert_one({
            "user_id": firebase_uid,
            "item_id": item_id,
            "interaction_type": "purchase",
            "created_at": datetime.utcnow()
        })
        print(f"[CART] User: {firebase_uid} added Item: {item_id} to cart (purchase)")
        return jsonify({'message': 'Item added to cart!'}), 200
    

    except Exception as e:
        print(f"Error in /api/cart/add: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
    
@app.route('/api/cart', methods=['GET'])
@verify_token
def get_cart():
    # Get the Firebase UID from the verified token
    auth_header = request.headers.get('Authorization')
    token = auth_header.replace('Bearer ', '')
    decoded = auth.verify_id_token(token)
    firebase_uid = decoded['uid']

    # Get the user's cart
    user = db["users"].find_one({"firebase_uid": firebase_uid})
    if not user or "cart" not in user or not user["cart"]:
        return jsonify({"cart": []})

    # Get item details for each item in the cart
    items = list(db["clothing_items"].find({"id": {"$in": user["cart"]}}))
    # Convert ObjectId to string and remove MongoDB-specific fields
    for item in items:
        item["_id"] = str(item["_id"])
    return jsonify({"cart": items})


@app.route('/api/clothing-items', methods=['GET'])
def get_clothing_items():
    items = list(db["clothing_items"].find())
    # Convert ObjectId to string and remove MongoDB-specific fields
    for item in items:
        item["_id"] = str(item["_id"])
    return jsonify({"clothing_items": items})

@app.route('/api/closet/add', methods=['POST'])
@verify_token
def add_to_closet():
    data = request.json
    firebase_uid = data.get('firebase_uid')
    item_id = data.get('item_id')

    if not firebase_uid or not item_id:
        return jsonify({'error': 'Missing firebase_uid or item_id'}), 400

    db["users"].update_one(
        {"firebase_uid": firebase_uid},
        {"$addToSet": {"closet": item_id}, "$set": {"updated_at": datetime.utcnow()}}
    )
    print(f"[CLOSET] User: {firebase_uid} saved Item: {item_id} to closet")

    return jsonify({'message': 'Item saved to closet!'}), 200

@app.route('/api/closet/remove', methods=['POST'])
@verify_token
def remove_from_closet():
    data = request.json
    firebase_uid = data.get('firebase_uid')
    item_id = data.get('item_id')

    if not firebase_uid or not item_id:
        return jsonify({'error': 'Missing firebase_uid or item_id'}), 400

    db["users"].update_one(
        {"firebase_uid": firebase_uid},
        {"$pull": {"closet": item_id}, "$set": {"updated_at": datetime.utcnow()}}
    )
    print(f"[CLOSET] User: {firebase_uid} removed Item: {item_id} from closet")
    return jsonify({'message': 'Item removed from closet!'}), 200

@app.route('/api/closet', methods=['GET'])
@verify_token
def get_closet():
    auth_header = request.headers.get('Authorization')
    token = auth_header.replace('Bearer ', '')
    decoded = auth.verify_id_token(token)
    firebase_uid = decoded['uid']

    user = db["users"].find_one({"firebase_uid": firebase_uid})
    if not user or "closet" not in user or not user["closet"]:
        return jsonify({"closet": []})

    items = list(db["clothing_items"].find({"id": {"$in": user["closet"]}}))
    for item in items:
        item["_id"] = str(item["_id"])
    return jsonify({"closet": items})

@app.route('/api/events', methods=['GET'])
def get_events():
    events = db["clothing_items"].distinct("event")
    return jsonify({"events": events})

@app.route('/api/events/<event_name>', methods=['GET'])
def get_items_by_event(event_name):
    items = list(db["clothing_items"].find({"event": event_name}))
    for item in items:
        item["_id"] = str(item["_id"])  # Convert ObjectId to string for JSON
    return jsonify({"items": items})

@app.route('/api/seller/products', methods=['POST'])
@verify_token
def add_seller_product():
    try:
        # Get seller UID from token
        auth_header = request.headers.get('Authorization')
        token = auth_header.replace('Bearer ', '')
        decoded = auth.verify_id_token(token)
        seller_uid = decoded['uid']

        data = request.json
        # Validate required fields
        required_fields = ['name', 'brand', 'category', 'image', 'price']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing field: {field}'}), 400

        # Generate a new product ID (auto-increment)
        last = db["clothing_items"].find_one(sort=[("id", -1)])
        new_id = (last["id"] + 1) if last and "id" in last else 1

        product = {
            "id": new_id,
            "name": data["name"],
            "brand": data["brand"],
            "category": data["category"],
            "image": data["image"],
            "price": float(data["price"]),
            "quantity": int(data.get("quantity", 1)),
            "sizes": data.get("sizes", []),
            "inStock": data.get("inStock", True),
            "description": data.get("description", ""),
            "seller_id": seller_uid,
            "created_at": datetime.utcnow()
        }

        result = db["clothing_items"].insert_one(product)
        product["_id"] = str(result.inserted_id)
        return jsonify({"message": "Product added!", "product": product}), 201

    except Exception as e:
        print("Error in /api/seller/products:", str(e))
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/seller/products', methods=['GET'])
@verify_token
def get_seller_products():
    try:
        # Get seller UID from token
        auth_header = request.headers.get('Authorization')
        token = auth_header.replace('Bearer ', '')
        decoded = auth.verify_id_token(token)
        seller_uid = decoded['uid']

        # Find products where seller_id matches
        products = list(db["clothing_items"].find({"seller_id": seller_uid}))
        for prod in products:
            prod["_id"] = str(prod["_id"])  # Convert ObjectId to string

        return jsonify({"products": products}), 200

    except Exception as e:
        print("Error in GET /api/seller/products:", str(e))
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/seller/products/<int:product_id>', methods=['PUT'])
@verify_token
def edit_seller_product(product_id):
    try:
        # Get seller UID from token
        auth_header = request.headers.get('Authorization')
        token = auth_header.replace('Bearer ', '')
        decoded = auth.verify_id_token(token)
        seller_uid = decoded['uid']

        data = request.json
        # Only allow editing products owned by this seller
        product = db["clothing_items"].find_one({"id": product_id, "seller_id": seller_uid})
        if not product:
            return jsonify({"error": "Product not found or not authorized"}), 404

        update_fields = {}
        for field in ["name", "brand", "category", "image", "price", "inStock", "description", "quantity", "sizes"]:
            if field in data:
                update_fields[field] = data[field]

        # Convert price to float, quantity to int, sizes to list
        if "price" in update_fields:
            update_fields["price"] = float(update_fields["price"])
        if "quantity" in update_fields:
            try:
                update_fields["quantity"] = int(update_fields["quantity"])
            except Exception:
                update_fields["quantity"] = 1
        if "sizes" in update_fields:
            if isinstance(update_fields["sizes"], str):
                update_fields["sizes"] = [s.strip() for s in update_fields["sizes"].split(",") if s.strip()]

        db["clothing_items"].update_one(
            {"id": product_id, "seller_id": seller_uid},
            {"$set": update_fields}
        )
        return jsonify({"message": "Product updated!"}), 200

    except Exception as e:
        print("Error in PUT /api/seller/products/<id>:", str(e))
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/seller/products/<int:product_id>', methods=['DELETE'])
@verify_token
def delete_seller_product(product_id):
    try:
        # Get seller UID from token
        auth_header = request.headers.get('Authorization')
        token = auth_header.replace('Bearer ', '')
        decoded = auth.verify_id_token(token)
        seller_uid = decoded['uid']

        result = db["clothing_items"].delete_one({"id": product_id, "seller_id": seller_uid})
        if result.deleted_count == 0:
            return jsonify({"error": "Product not found or not authorized"}), 404

        return jsonify({"message": "Product deleted!"}), 200

    except Exception as e:
        print("Error in DELETE /api/seller/products/<id>:", str(e))
        return jsonify({"error": str(e)}), 500
    

# Place a new order (buyer)
@app.route('/api/orders', methods=['POST'])
@verify_token
def place_order():
    try:
        auth_header = request.headers.get('Authorization')
        token = auth_header.replace('Bearer ', '')
        decoded = auth.verify_id_token(token)
        buyer_id = decoded['uid']

        # Get buyer's cart
        user = db["users"].find_one({"firebase_uid": buyer_id})
        if not user or "cart" not in user or not user["cart"]:
            return jsonify({"error": "Cart is empty"}), 400

        # Get item details
        items = list(db["clothing_items"].find({"id": {"$in": user["cart"]}}))
        if not items:
            return jsonify({"error": "No valid items in cart"}), 400

        # Group items by seller
        seller_orders = {}
        for item in items:
            seller_id = item.get("seller_id", "unknown")
            if seller_id not in seller_orders:
                seller_orders[seller_id] = []
            seller_orders[seller_id].append(item)

        order_ids = []
        for seller_id, seller_items in seller_orders.items():
            total = sum(item["price"] for item in seller_items)
            order_doc = {
                "buyer_id": buyer_id,
                "seller_id": seller_id,
                "items": [
                    {
                        "id": item["id"],
                        "name": item["name"],
                        "price": item["price"],
                        "quantity": 1  # You can expand this if you add quantity support
                    } for item in seller_items
                ],
                "total": total,
                "status": "pending",
                "created_at": datetime.utcnow()
            }
            result = db["orders"].insert_one(order_doc)
            order_ids.append(str(result.inserted_id))

        # Clear buyer's cart
        db["users"].update_one(
            {"firebase_uid": buyer_id},
            {"$set": {"cart": []}}
        )

        return jsonify({"message": "Order(s) placed!", "order_ids": order_ids}), 201

    except Exception as e:
        print("Error in POST /api/orders:", str(e))
        return jsonify({"error": str(e)}), 500

# Seller: Get all orders for their products
@app.route('/api/seller/orders', methods=['GET'])
@verify_token
def get_seller_orders():
    try:
        auth_header = request.headers.get('Authorization')
        token = auth_header.replace('Bearer ', '')
        decoded = auth.verify_id_token(token)
        seller_id = decoded['uid']

        # Find all orders for this seller
        orders = list(db["orders"].find({"seller_id": seller_id}))
        for order in orders:
            order["_id"] = str(order["_id"])
        # Lookup buyer info
            buyer = db["users"].find_one({"firebase_uid": order["buyer_id"]})
            if buyer:
                order["buyer_email"] = buyer.get("email", "")
                order["buyer_name"] = f"{buyer.get('first_name', '')} {buyer.get('last_name', '')}".strip()
            else:
                order["buyer_email"] = ""
                order["buyer_name"] = ""
        return jsonify({"orders": orders}), 200

    except Exception as e:
        print("Error in GET /api/seller/orders:", str(e))
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/orders', methods=['GET'])
@verify_token
def get_buyer_orders():
    try:
        auth_header = request.headers.get('Authorization')
        token = auth_header.replace('Bearer ', '')
        decoded = auth.verify_id_token(token)
        buyer_id = decoded['uid']

        orders = list(db["orders"].find({"buyer_id": buyer_id}))
        for order in orders:
            order["_id"] = str(order["_id"])
        return jsonify({"orders": orders}), 200

    except Exception as e:
        print("Error in GET /api/orders:", str(e))
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/seller/orders/<order_id>/status', methods=['PUT'])
@verify_token
def update_order_status(order_id):
    try:
        auth_header = request.headers.get('Authorization')
        token = auth_header.replace('Bearer ', '')
        decoded = auth.verify_id_token(token)
        seller_id = decoded['uid']

        data = request.json
        new_status = data.get("status")
        if new_status not in ["pending", "shipped", "delivered", "cancelled"]:
            return jsonify({"error": "Invalid status"}), 400

        # Only allow seller to update their own orders
        result = db["orders"].update_one(
            {"_id": ObjectId(order_id), "seller_id": seller_id},
            {"$set": {"status": new_status}}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Order not found or not authorized"}), 404

        return jsonify({"message": "Order status updated!"}), 200

    except Exception as e:
        print("Error in PUT /api/seller/orders/<order_id>/status:", str(e))
        return jsonify({"error": str(e)}), 500
    


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)



