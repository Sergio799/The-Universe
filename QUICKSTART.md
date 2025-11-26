# 🚀 Quick Start Guide

## Run the Universe

```bash
cd sai-universe
npm run dev
```

Then open http://localhost:3000

## What You'll See

1. **Big Bang Hero** - 5000+ particle explosion with custom GLSL shaders
2. **Constellation** - Interactive star map with 5 clickable passions
3. **Orbital System** - Solar system with 3 orbiting career planets
4. **Project Lab** - 5 floating 3D project capsules with particle effects
5. **DNA Helix** - Rotating double helix with 30+ skills
6. **Portal** - Swirling wormhole with contact form and 2000+ particles

All sections are fully interactive - click, drag, zoom, and explore!

## Next Steps

### Customize Your Data

1. **Edit Experience** - `components/sections/OrbitalSystem.tsx`
   - Update company names, roles, dates
   - Change colors and descriptions

2. **Edit Passions** - `components/sections/Constellation.tsx`
   - Modify constellation data
   - Add your own stories

3. **Add Projects** - `components/sections/ProjectLab.tsx`
   - Build 3D capsules for your projects

4. **Add Skills** - `components/sections/DNAHelix.tsx`
   - Create rotating DNA helix with your tech stack

5. **Update Contact** - `components/sections/Portal.tsx`
   - Add your email and social links

### Optional Enhancements

**Add 3D Text for Initials**:
1. Download Inter Bold font as JSON from https://gero3.github.io/facetype.js/
2. Place in `public/fonts/inter_bold.json`
3. Uncomment NebulaInitials component in BigBang.tsx

**Add Audio**:
1. Add heartbeat.mp3 to `public/audio/`
2. Audio tag is already in BigBang.tsx

**Add Your Photo**:
- See CUSTOMIZATION_GUIDE.md for details

## Performance Tips

- The 3D scenes use WebGL - works best on modern browsers
- Reduce particle count in BigBangParticles.tsx if needed (line 11)
- Adjust bloom intensity for performance

## Troubleshooting

**Black screen?**
- Check browser console for errors
- Ensure WebGL is supported
- Try disabling browser extensions

**Slow performance?**
- Reduce particle count
- Lower bloom quality
- Disable post-processing effects

Enjoy building your cosmic portfolio! 🌌
