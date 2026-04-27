// internal
import Link from 'next/link';
import { CloseTwo } from '@/svg';
import MobileMenus from './mobile-menus';

const OffCanvas = ({ isOffCanvasOpen, setIsCanvasOpen }) => {
  return (
    <>
      <div className={`offcanvas__area offcanvas__radius ${isOffCanvasOpen ? "offcanvas-opened" : ""}`}>
        <div className="offcanvas__wrapper">
          <div className="offcanvas__close">
            <button onClick={() => setIsCanvasOpen(false)} className="offcanvas__close-btn offcanvas-close-btn">
              <CloseTwo />
            </button>
          </div>
          <div className="offcanvas__content">
            <div className="aura-mobile-drawer">
              <div className="aura-mobile-drawer-head">
                <span className="aura-mobile-drawer-kicker">NEES Medical</span>
                <h2>Browse</h2>
                <p>Retail skincare, machines, clinic access, and support in one place.</p>
              </div>

              <div className="tp-main-menu-mobile fix d-lg-none mb-35">
                <MobileMenus />
              </div>

              <div className="aura-mobile-drawer-footer">
                <Link href="/contact" className="aura-mobile-drawer-support" onClick={() => setIsCanvasOpen(false)}>
                  Need help? Contact support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* body overlay start */}
      <div onClick={() => setIsCanvasOpen(false)} className={`body-overlay ${isOffCanvasOpen ? 'opened' : ''}`}></div>
      {/* body overlay end */}
    </>
  );
};

export default OffCanvas;
