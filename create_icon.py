"""
Create icon for YukMengetik application
Simple keyboard/typing icon
"""
from PIL import Image, ImageDraw, ImageFont
import os

def create_app_icon():
    """Create a simple keyboard/typing icon"""
    
    # Create 256x256 image with transparent background
    size = 256
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Colors
    bg_color = (67, 56, 202)      # Indigo (primary color from app)
    key_color = (255, 255, 255)   # White
    accent_color = (14, 165, 233) # Sky blue (accent)
    shadow_color = (30, 41, 59, 100)  # Dark shadow
    
    # Draw main background circle with gradient effect
    center = size // 2
    radius = size // 2 - 20
    
    # Shadow
    draw.ellipse([center-radius+5, center-radius+5, center+radius+5, center+radius+5], 
                 fill=shadow_color)
    
    # Main circle
    draw.ellipse([center-radius, center-radius, center+radius, center+radius], 
                 fill=bg_color)
    
    # Draw keyboard keys
    key_size = 25
    key_spacing = 35
    
    # Row 1 - QWERTY
    keys_row1 = ['Q', 'W', 'E', 'R', 'T', 'Y']
    start_x = center - (len(keys_row1) * key_spacing) // 2
    y1 = center - 40
    
    for i, key in enumerate(keys_row1):
        x = start_x + i * key_spacing
        # Key shadow
        draw.rounded_rectangle([x+2, y1+2, x+key_size+2, y1+key_size+2], 
                              radius=4, fill=(0, 0, 0, 50))
        # Key
        draw.rounded_rectangle([x, y1, x+key_size, y1+key_size], 
                              radius=4, fill=key_color)
        # Key text
        try:
            font = ImageFont.truetype("arial.ttf", 12)
        except:
            font = ImageFont.load_default()
        
        bbox = draw.textbbox((0, 0), key, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        text_x = x + (key_size - text_width) // 2
        text_y = y1 + (key_size - text_height) // 2
        draw.text((text_x, text_y), key, fill=bg_color, font=font)
    
    # Row 2 - ASDF (shorter)
    keys_row2 = ['A', 'S', 'D', 'F']
    start_x2 = center - (len(keys_row2) * key_spacing) // 2
    y2 = center + 10
    
    for i, key in enumerate(keys_row2):
        x = start_x2 + i * key_spacing
        # Key shadow
        draw.rounded_rectangle([x+2, y2+2, x+key_size+2, y2+key_size+2], 
                              radius=4, fill=(0, 0, 0, 50))
        # Key
        draw.rounded_rectangle([x, y2, x+key_size, y2+key_size], 
                              radius=4, fill=key_color)
        # Key text
        bbox = draw.textbbox((0, 0), key, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        text_x = x + (key_size - text_width) // 2
        text_y = y2 + (key_size - text_height) // 2
        draw.text((text_x, text_y), key, fill=bg_color, font=font)
    
    # Spacebar
    spacebar_width = 80
    spacebar_height = 20
    spacebar_x = center - spacebar_width // 2
    spacebar_y = center + 60
    
    # Spacebar shadow
    draw.rounded_rectangle([spacebar_x+2, spacebar_y+2, 
                           spacebar_x+spacebar_width+2, spacebar_y+spacebar_height+2], 
                          radius=6, fill=(0, 0, 0, 50))
    # Spacebar
    draw.rounded_rectangle([spacebar_x, spacebar_y, 
                           spacebar_x+spacebar_width, spacebar_y+spacebar_height], 
                          radius=6, fill=key_color)
    
    # Add typing cursor/caret
    cursor_x = center + 60
    cursor_y = center - 20
    cursor_width = 3
    cursor_height = 30
    draw.rectangle([cursor_x, cursor_y, cursor_x+cursor_width, cursor_y+cursor_height], 
                   fill=accent_color)
    
    # Add small speed lines for "fast typing" effect
    for i in range(3):
        line_x = cursor_x + 10 + i * 8
        line_y = cursor_y + 5 + i * 3
        draw.rectangle([line_x, line_y, line_x+15, line_y+2], fill=accent_color)
    
    # Save as ICO file (Windows icon format)
    # Create multiple sizes for better Windows compatibility
    sizes = [256, 128, 64, 48, 32, 16]
    images = []
    
    for s in sizes:
        resized = img.resize((s, s), Image.Resampling.LANCZOS)
        images.append(resized)
    
    # Save as .ico file
    img.save('app_icon.ico', format='ICO', sizes=[(s, s) for s in sizes])
    
    # Also save as PNG for preview
    img.save('app_icon.png', format='PNG')
    
    print("✅ Icon created successfully!")
    print("   - app_icon.ico (for Windows)")
    print("   - app_icon.png (for preview)")

if __name__ == '__main__':
    try:
        create_app_icon()
    except ImportError:
        print("❌ PIL (Pillow) not installed. Installing...")
        os.system("pip install Pillow")
        create_app_icon()