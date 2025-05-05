// ❌ OLD
// import tailwindcss from 'tailwindcss';
// export default { plugins: { tailwindcss: {}, autoprefixer: {} } };

// ✅ NEW
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [tailwindcss(), autoprefixer()],
};
