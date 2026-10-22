import { formatDate } from '../utils/format';

function MachineDetailsCard({ machine }) {
  const rows = [
    { label: 'Seller Company', value: machine.sellerCompanyName },
    { label: 'Machine Name', value: machine.machineName },
    { label: 'Model Number', value: machine.modelNumber },
    { label: 'Sale Date', value: formatDate(machine.saleDate) },
    // Two-column grid fills row by row: Serial Number lands under Model Number,
    // Registered On under Sale Date.
    { label: 'Serial Number', value: machine.serialNumber, serial: true },
    { label: 'Registered On', value: machine.createdAt ? formatDate(machine.createdAt) : '' },
  ];

  return (
    <dl className="detail-grid">
      {rows.map((row) => (
        <div className="detail-grid__row" key={row.label}>
          <dt>{row.label}</dt>
          <dd className={row.serial ? 'detail-grid__serial' : undefined}>{row.value || '—'}</dd>
        </div>
      ))}
    </dl>
  );
}

export default MachineDetailsCard;
