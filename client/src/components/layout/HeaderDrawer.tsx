import { AlignRight } from "lucide-react";

const HeaderDrawer = () => {
  return (
    <div className="drawer drawer-end">
      {/* ⚠️ NÃO usar aria-hidden aqui */}
      <input id="header-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content">
        <label
          htmlFor="header-drawer"
          className="btn btn-square btn-ghost drawer-button"
          aria-label="Abrir menu"
        >
          <AlignRight aria-hidden="true" />
        </label>
      </div>

      <div className="drawer-side">
        <label
          htmlFor="header-drawer"
          className="drawer-overlay"
          aria-label="Fechar menu"
        ></label>

        <aside
          className="menu bg-base-200 text-base-content min-h-full w-80 p-4"
          role="navigation"
          aria-label="Menu lateral"
        >
          <ul>
            <li>
              <a href="#item1">Item do Menu 1</a>
            </li>
            <li>
              <a href="#item2">Item do Menu 2</a>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default HeaderDrawer;
