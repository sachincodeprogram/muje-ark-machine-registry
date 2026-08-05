import arkLogo from '../assets/ark-logo.png';

function PrintHeader({ title }) {
  return (
    <div className="print-only print-header">
      <img src={arkLogo} alt="ARK Group" className="print-header__mark" />
      <div className="print-header__brand">ARK Machine Registry</div>
      <div className="print-header__title">{title}</div>
      <div className="print-header__meta">Printed on {new Date().toLocaleString()}</div>
    </div>
  );
}

export default PrintHeader;
