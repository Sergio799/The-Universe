# Quick Reference Card

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📦 Project Structure

```
sai-universe/
├── app/                    # Next.js app
│   ├── page.tsx           # Main page (optimized)
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── common/            # Reusable components
│   │   ├── ErrorBoundary.tsx
│   │   └── LazySection.tsx
│   ├── sections/          # Page sections
│   │   ├── Landing.tsx
│   │   ├── OrbitalSystem.tsx
│   │   └── Lab.tsx
│   └── three/             # 3D components
├── hooks/                 # Custom hooks
│   ├── useLazyLoad.ts
│   └── useOptimizedCanvas.ts
├── lib/                   # Utilities
│   ├── data/             # Data files
│   ├── performance.ts    # Monitoring
│   └── adaptiveConfig.ts # Adaptive loading
└── docs/                 # Documentation
```

## 🎯 Key Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Run production build

# Quality
npm run lint            # Lint code
npm run type-check      # TypeScript check
```

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| Initial Load | <1s |
| FPS | 60 |
| Bundle Size | 200 KB (main) |
| Lighthouse | 95+ |

## 🔧 Common Tasks

### Add New Section
```typescript
// 1. Create component
// components/sections/NewSection.tsx

// 2. Add to page.tsx
const NewSection = dynamic(() => import('./sections/NewSection'));

// 3. Use LazySection
<LazySection id="new">
  <NewSection />
</LazySection>
```

### Add New Experience
```typescript
// lib/data/experience.ts
{
  id: 'new-exp',
  name: 'Company',
  role: 'Role',
  // ... other fields
}
```

### Monitor Performance
```typescript
import { PerformanceMonitor } from '@/lib/performance';

const monitor = PerformanceMonitor.getInstance();
monitor.mark('operation');
// ... work
monitor.measure('operation');
```

## 🐛 Troubleshooting

### Slow Loading
1. Check network tab
2. Verify code splitting
3. Check FPS monitor
4. Review bundle sizes

### Scroll Issues
1. Check `scroll-snap-type`
2. Verify `overscroll-behavior`
3. Test on different devices

### 3D Performance
1. Reduce star count
2. Disable shadows
3. Lower DPR
4. Check device tier

## 📚 Documentation

- `FINAL_OPTIMIZATION_SUMMARY.md` - Complete overview
- `CODE_SPLITTING_GUIDE.md` - Code splitting details
- `PERFORMANCE_FIXES.md` - Performance improvements
- `OPTIMIZATION_REPORT.md` - Technical report

## 🔗 Quick Links

- [Next.js Docs](https://nextjs.org/docs)
- [Three.js Docs](https://threejs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)

---

**Need Help?** Check the documentation files above!
