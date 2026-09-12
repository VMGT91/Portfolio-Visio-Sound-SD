import math

def generate_ribbon(filename, is_top=True):
    width, height = 900, 750
    paths = []
    num_lines = 36
    
    for i in range(num_lines):
        t = i / (num_lines - 1)
        
        # Color gradient: dark teal to bright electric cyan
        r = int(0 + 15 * t)
        g = int(180 + 75 * t)
        b = int(195 + 60 * (1 - abs(t - 0.5)))
        color = f"rgb({r},{g},{b})"
        opacity = 0.25 + 0.65 * (1 - abs(t - 0.5) * 1.3)
        opacity = max(0.18, min(0.9, opacity))
        stroke_w = 1.2
        
        spread = (i - num_lines/2) * 8.5
        
        if is_top:
            p0 = (width + 60, -80 + spread * 1.4)
            c1 = (width - 120 + spread * 0.9, 140 + spread * 0.7)
            c2 = (width - 380 + spread * 0.6, 60 - spread * 0.4)
            c3 = (width - 550 + spread * 0.4, 260 + spread * 0.8)
            c4 = (width - 820 + spread * 0.2, 220 + spread * 0.5)
            d = f"M {p0[0]:.1f},{p0[1]:.1f} C {c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {c3[0]:.1f},{c3[0]:.1f} S {c4[0]:.1f},{c4[1]:.1f} {width-950},{360 + spread*0.3}"
        else:
            p0 = (-60, height + 80 + spread * 1.4)
            c1 = (120 + spread * 0.9, height - 140 - spread * 0.7)
            c2 = (380 + spread * 0.6, height - 60 + spread * 0.4)
            c3 = (550 + spread * 0.4, height - 260 - spread * 0.8)
            c4 = (820 + spread * 0.2, height - 220 - spread * 0.5)
            d = f"M {p0[0]:.1f},{p0[1]:.1f} C {c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {c3[0]:.1f},{c3[0]:.1f} S {c4[0]:.1f},{c4[1]:.1f} {950},{height - 360 - spread*0.3}"
            
        paths.append(f'  <path d="{d}" stroke="{color}" stroke-width="{stroke_w}" stroke-opacity="{opacity:.2f}" fill="none" />')

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="100%" height="100%" preserveAspectRatio="none">
<defs>
  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="1.5" result="blur" />
    <feComposite in="SourceGraphic" in2="blur" operator="over" />
  </filter>
</defs>
<g filter="url(#glow)">
{chr(10).join(paths)}
</g>
</svg>'''
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(svg_content)

if __name__ == '__main__':
    generate_ribbon('C:/Users/visio/.gemini/antigravity/scratch/visiosound-portfolio/assets/wave-top-right.svg', True)
    generate_ribbon('C:/Users/visio/.gemini/antigravity/scratch/visiosound-portfolio/assets/wave-bottom-left.svg', False)
    print('OK: Generated SVG wave ribbons')
