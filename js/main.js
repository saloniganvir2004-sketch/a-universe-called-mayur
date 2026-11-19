/* ==========================================================================
   A UNIVERSE CALLED MAYUR — Main Application Entry Point
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('%c A UNIVERSE CALLED MAYUR %c Dedicated Exclusively to Mayur ', 
    'background: #C49A54; color: #090909; font-weight: bold; padding: 4px 8px; border-radius: 3px;', 
    'background: #101B35; color: #E8D8B8; padding: 4px 8px; border-radius: 3px;'
  );

  // Keyboard shortcut to close museum plaque modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('museum-modal-backdrop');
      if (modal && modal.classList.contains('open')) {
        modal.classList.remove('open');
      }
    }
  });
});
