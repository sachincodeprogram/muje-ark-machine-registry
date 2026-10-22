import { useState } from 'react';

import { registerMachine } from '../api/machines';
import Alert from '../components/Alert';
import FormField from '../components/FormField';
import MachineDetailsCard from '../components/MachineDetailsCard';
import PrintHeader from '../components/PrintHeader';
import { useClipboard } from '../hooks/useClipboard';

const INITIAL_FORM = {
  sellerCompanyName: '',
  machineName: '',
  modelNumber: '',
  serialNumber: '',
  saleDate: '',
};

function validate(form) {
  const errors = {};

  if (!form.sellerCompanyName.trim()) {
    errors.sellerCompanyName = 'Seller company name is required.';
  }
  if (!form.machineName.trim()) {
    errors.machineName = 'Machine name is required.';
  }
  if (!form.modelNumber.trim()) {
    errors.modelNumber = 'Model number is required.';
  }
  if (!form.serialNumber.trim()) {
    errors.serialNumber = 'Serial number is required.';
  }
  if (!form.saleDate) {
    errors.saleDate = 'Sale date is required.';
  }

  return errors;
}

function RegisterSalePage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, copy] = useClipboard();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setServerError('');

    try {
      const data = await registerMachine({
        sellerCompanyName: form.sellerCompanyName.trim(),
        machineName: form.machineName.trim(),
        modelNumber: form.modelNumber.trim(),
        serialNumber: form.serialNumber.trim(),
        saleDate: form.saleDate,
      });
      setResult(data);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleRegisterAnother() {
    setForm(INITIAL_FORM);
    setErrors({});
    setServerError('');
    setResult(null);
  }

  if (result) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Register a Machine Sale</h1>
          <p>Log a new equipment sale and generate its official ARK registry ID.</p>
        </div>

        <div className="card success-card">
          <PrintHeader title="Sale Registration Receipt" />

          <div className="success-card__icon no-print" aria-hidden="true">
            ✓
          </div>
          <h2 className="success-card__title">Machine Registered Successfully</h2>
          <p className="success-card__subtitle no-print">
            Save this unique ID — it&apos;s required to look up this machine later.
          </p>

          <div className="success-card__id-row">
            <span className="success-card__id">{result.uniqueId}</span>
            <div className="success-card__actions no-print">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => copy(result.uniqueId)}
              >
                {copied ? 'Copied!' : 'Copy ID'}
              </button>
              <button type="button" className="btn btn--secondary" onClick={() => window.print()}>
                Print
              </button>
            </div>
          </div>

          {result.machine && <MachineDetailsCard machine={result.machine} />}

          <button
            type="button"
            className="btn btn--primary btn--block no-print"
            onClick={handleRegisterAnother}
          >
            Register Another Machine
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Register a Machine Sale</h1>
        <p>Log a new equipment sale and generate its official ARK registry ID.</p>
      </div>

      <div className="card">
        {serverError && <Alert variant="error">{serverError}</Alert>}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <FormField label="Seller Company Name" id="sellerCompanyName" error={errors.sellerCompanyName}>
            <input
              id="sellerCompanyName"
              name="sellerCompanyName"
              type="text"
              className={`form-input${errors.sellerCompanyName ? ' form-input--invalid' : ''}`}
              value={form.sellerCompanyName}
              onChange={handleChange}
              placeholder="e.g. Summit Industrial Supply"
              autoComplete="organization"
            />
          </FormField>

          <FormField label="Machine Name" id="machineName" error={errors.machineName}>
            <input
              id="machineName"
              name="machineName"
              type="text"
              className={`form-input${errors.machineName ? ' form-input--invalid' : ''}`}
              value={form.machineName}
              onChange={handleChange}
              placeholder="e.g. Hydraulic Press"
              autoComplete="off"
            />
          </FormField>

          <FormField label="Model Number" id="modelNumber" error={errors.modelNumber}>
            <input
              id="modelNumber"
              name="modelNumber"
              type="text"
              className={`form-input${errors.modelNumber ? ' form-input--invalid' : ''}`}
              value={form.modelNumber}
              onChange={handleChange}
              placeholder="e.g. HP-4500X"
              autoComplete="off"
            />
          </FormField>

          <FormField label="Serial Number" id="serialNumber" error={errors.serialNumber}>
            <input
              id="serialNumber"
              name="serialNumber"
              type="text"
              className={`form-input${errors.serialNumber ? ' form-input--invalid' : ''}`}
              value={form.serialNumber}
              onChange={handleChange}
              placeholder="e.g. SN-4587-XK"
              autoComplete="off"
            />
          </FormField>

          <FormField label="Sale Date" id="saleDate" error={errors.saleDate}>
            <input
              id="saleDate"
              name="saleDate"
              type="date"
              className={`form-input${errors.saleDate ? ' form-input--invalid' : ''}`}
              value={form.saleDate}
              onChange={handleChange}
            />
          </FormField>

          <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
            {submitting ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Registering…
              </>
            ) : (
              'Register Machine'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterSalePage;
