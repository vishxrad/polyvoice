import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
});
=======
  server: {
    allowedHosts: ['hackathon.polyvoice.tech',
      'polyvoice.tech'
    ]

  }
})
>>>>>>> d8b71d09c2e0eac6b627103f441b7b3ad55c3924
