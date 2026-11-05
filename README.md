# Passage payment prototype

Run `npm install` then `npm run dev`. Build with `npm run build`.

React + TypeScript + Vite, with Tailwind CSS configured through its Vite plugin. Reusable components live in `components/ui`, shared helpers in `lib`, and global styles in `styles.css`. The `@/` alias resolves to the project root. This follows the component paths in the supplied shadcn-style prompts.

The supplied animated ticket and feedback widget are integrated with an adapted payment form. Payment state stays in memory. No backend, real payment processing, or card storage is used. Wallet buttons simulate payments. Use Fill demo, pay, download the generated PDF, then continue to feedback. Select a rating to expand the feedback editor; Preview renders Markdown. Submit displays confirmation. The brand link and Start a new demo reset the flow. Refreshing clears the prototype.
