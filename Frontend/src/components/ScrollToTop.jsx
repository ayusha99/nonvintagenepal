import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

function scrollWindowToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    scrollWindowToTop();
  }, [pathname]);

  return null;
}

export default ScrollToTop;
