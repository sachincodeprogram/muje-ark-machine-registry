import { formatDate } from '../utils/format';

function MachineDetailsCard({ machine }) {
  const rows = [
    { label: 'Seller Company', value: machine.sellerCompanyName },
    { label: 'Machine Name', value: machine.machineName },
    { label: 'Model Number', value: machine.modelNumber },
    { label: 'Sale Date', value: formatDate(machine.saleDate) },
  ];

  if (machine.createdAt) {
    rows.push({ label: 'Registered On', value: formatDate(machine.createdAt) });
  }

  return (
    <dl className="detail-grid">
      {rows.map((row) => (
        <div className="detail-grid__row" key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value || '—'}</dd>
        </div>
      ))}
    </dl>
  );
}

export default MachineDetailsCard;
