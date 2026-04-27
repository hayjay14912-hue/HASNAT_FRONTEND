import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { machines_menu_brands } from '@/data/machines-menu-data';

const MachinesMegaMenu = () => {
  const brands = machines_menu_brands;
  const [activeBrandId, setActiveBrandId] = useState(brands?.[0]?.id || null);

  const activeBrand = useMemo(() => brands.find((b) => b.id === activeBrandId) || brands[0], [brands, activeBrandId]);
  const machines = activeBrand?.machines || [];

  const visibleMachines = machines.slice(0, 6);

  return (
    <div className="aura-machines-mega-inner" role="menu" aria-label="Machines menu">
      <div className="aura-machines-col aura-machines-brands">
        <div className="aura-machines-col-head">Top Machine Brands</div>
        <div className="aura-machines-brand-list" role="listbox" aria-label="Brands">
          {brands.map((brand) => {
            const isActive = brand.id === activeBrand?.id;
            return (
              <button
                key={brand.id}
                type="button"
                className={`aura-machines-brand ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveBrandId(brand.id)}
                aria-selected={isActive}
              >
                <span className="aura-machines-brand-logo">
                  <Image src={brand.logo} alt={`${brand.name} logo`} />
                </span>
                <span className="aura-machines-brand-name">{brand.name}</span>
                <span className="aura-machines-count">{brand.machines?.length || 0}</span>
              </button>
            );
          })}
        </div>
        <div className="aura-machines-col-foot">
          <Link href="/medical-devices" className="aura-machines-viewall">
            View all machines
          </Link>
        </div>
      </div>

      <div className="aura-machines-col aura-machines-grid">
        <div className="aura-machines-grid-head">
          <div className="aura-machines-col-head">Machines</div>
          {activeBrand?.link ? (
            <Link href={activeBrand.link} className="aura-machines-mini-link">
              View all
            </Link>
          ) : null}
        </div>

        <div className="aura-machines-cards" role="list" aria-label="Machines list">
          {visibleMachines.map((machine) => {
            return (
              <Link
                key={machine.id}
                href={machine.link || '/medical-devices'}
                className="aura-machine-card"
              >
                <span className="aura-machine-thumb">
                  <Image src={machine.image} alt="" />
                </span>
                <span className="aura-machine-meta">
                  <span className="aura-machine-title">{machine.name}</span>
                  <span className="aura-machine-bestfor">Best for: {machine.bestFor}</span>
                  <span className="aura-machine-tags">
                    {(machine.tags || []).slice(0, 3).map((t) => (
                      <span key={t} className="aura-machine-chip">
                        {t}
                      </span>
                    ))}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="aura-machines-col aura-machines-detail">
        <div className="aura-machines-col-head">Selected Brand</div>
        {activeBrand ? (
          <>
            <div className="aura-machines-detail-hero">
              <div className="aura-machines-detail-brand">
                <Image src={activeBrand.logo} alt={`${activeBrand.name} logo`} />
              </div>
              <div className="aura-machines-detail-title">{activeBrand.name}</div>
              <div className="aura-machines-detail-sub">{machines.length} machine(s)</div>
            </div>

            <div className="aura-machines-ctas">
              <Link href="/request-quote" className="tp-btn tp-btn-2 aura-machines-cta">
                Request Quote
              </Link>
              <Link href={activeBrand.link || '/medical-devices'} className="tp-btn-2 tp-btn-border-2 aura-machines-cta aura-machines-cta-secondary">
                View All {activeBrand.name}
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default MachinesMegaMenu;
