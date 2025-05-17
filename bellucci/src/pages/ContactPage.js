import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div style={{
      padding: '40px 20px',
      maxWidth: 1200,
      margin: '0 auto',
      backgroundColor: '#f9f9f9',
      minHeight: 'calc(100vh - 80px)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        padding: 40
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: '2.5rem', color: '#333', marginBottom: 12 }}>Get In Touch</h2>
          <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
            Have questions or feedback? We'd love to hear from you!
          </p>
        </div>

        {/* Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 40
        }}>
          {/* Contact Info */}
          <div style={{
            display: 'grid',
            gap: 20
          }}>
            {/* Email Card */}
            <div style={{
              padding: 24,
              borderRadius: 8,
              background: '#f5f5f5',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div style={{
                background: '#000',
                width: 50,
                height: 50,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16
              }}>
                <Mail size={24} color="white" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 8, color: '#333' }}>Email Us</h3>
              <p style={{ color: '#666', marginBottom: 12 }}>bellucciwebx1@gmail.com</p>
              <a href="mailto:support@bellucci.com" style={{
                color: '#000',
                textDecoration: 'none',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'color 0.3s ease'
              }}>
                Send a message
              </a>
            </div>

            {/* Phone Card */}
            <div style={{
              padding: 24,
              borderRadius: 8,
              background: '#f5f5f5',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div style={{
                background: '#000',
                width: 50,
                height: 50,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16
              }}>
                <Phone size={24} color="white" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 8, color: '#333' }}>Call Us</h3>
              <p style={{ color: '#666', marginBottom: 12 }}>+1 (555) 123-4567</p>
              <a href="tel:+15551234567" style={{
                color: '#000',
                textDecoration: 'none',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'color 0.3s ease'
              }}>
                Call now
              </a>
            </div>

            {/* Address Card */}
            <div style={{
              padding: 24,
              borderRadius: 8,
              background: '#f5f5f5',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div style={{
                background: '#000',
                width: 50,
                height: 50,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16
              }}>
                <MapPin size={24} color="white" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 8, color: '#333' }}>Visit Us</h3>
              <p style={{ color: '#666', marginBottom: 4 }}>123 Fashion Ave, Suite 456</p>
              <p style={{ color: '#666' }}>Madrid ( one day nshala)</p>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}>
            <h3 style={{ fontSize: '1.5rem', color: '#333', marginBottom: 10 }}>Send Us a Message</h3>
            
            {/* Name Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500, color: '#444' }}>Name</label>
              <input 
                type="text" 
                placeholder="Your name" 
                style={{
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  fontSize: '1rem',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>
            
            {/* Email Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500, color: '#444' }}>Email</label>
              <input 
                type="email" 
                placeholder="Your email" 
                style={{
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  fontSize: '1rem',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>
            
            {/* Subject Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500, color: '#444' }}>Subject</label>
              <input 
                type="text" 
                placeholder="Subject" 
                style={{
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  fontSize: '1rem',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>
            
            {/* Message Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500, color: '#444' }}>Message</label>
              <textarea 
                rows="5" 
                placeholder="Your message"
                style={{
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  fontSize: '1rem',
                  transition: 'border-color 0.3s ease',
                  resize: 'vertical'
                }}
              ></textarea>
            </div>
            
            {/* Submit Button */}
            <button style={{
              background: '#000',
              color: 'white',
              border: 'none',
              padding: '14px 24px',
              borderRadius: 6,
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.3s ease',
              alignSelf: 'flex-start'
            }}>
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}