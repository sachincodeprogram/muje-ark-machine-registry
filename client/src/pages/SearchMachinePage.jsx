import { useState } from 'react';

import { fetchMachineByUniqueId } from '../api/machines';
import Alert from '../components/Alert';
import MachineDetailsCard from '../components/MachineDetailsCard';
import PrintHeader from '../components/PrintHeader';
import Spinner from '../components/Spinner';
import { useClipboard } from '../hooks/useClipboard';

const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  NOT_FOUND: 'not_found',
  ERROR: 'error',
};

function SearchMachinePage() {
  const [uniqueId, setUniqueId] = useState('');
  const [status, setStatus] = useState(STATUS.IDLE);
  const [machine, setMachine] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchedId, setSearchedId] = useState('');
  const [copied, copy] = useClipboard();

  async function handleSearch(event) {
    event.preventDefault();

    const trimmedId = uniqueId.trim().toUpperCase();
    if (!trimmedId) {
      setStatus(STATUS.ERROR);
      setErrorMessage('Enter a unique ID to search.');
      return;
    }

    setStatus(STATUS.LOADING);
    setErrorMessage('');
    setSearchedId(trimmedId);

    try {
      const data = await fetchMachineByUniqueId(trimmedId);
      if (!data) {
        setMachine(null);
        setStatus(STATUS.NOT_FOUND);
      } else {
        setMachine(data);
        setStatus(STATUS.SUCCESS);
      }
    } catch (err) {
      setMachine(null);
      setErrorMessage(err.message);
      setStatus(STATUS.ERROR);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Search Machine</h1>
        <p>Look up a registered machine using its ARK unique ID.</p>
      </div>

      <div className="card no-print">
        <form className="search-bar" onSubmit={handleSearch}>
          <label htmlFor="uniqueId" className="visually-hidden">
            Machine unique ID
          </label>
          <input
            id="uniqueId"
            name="uniqueId"
            type="text"
            className="form-input search-bar__input"
            placeholder="ARK-20260730-AB12"
            value={uniqueId}
            onChange={(event) => setUniqueId(event.target.value)}
            autoComplete="off"
            spellCheck="false"
          />
          <button type="submit" className="btn btn--primary search-bar__button" disabled={status === STATUS.LOADING}>
            {status === STATUS.LOADING ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Searching…
              </>
            ) : (
              'Search'
            )}
          </button>
        </form>
      </div>

      {status === STATUS.LOADING && (
        <div className="card">
          <Spinner label="Looking up machine…" />
        </div>
      )}

      {status === STATUS.ERROR && (
        <div className="card">
          <Alert variant="error">{errorMessage}</Alert>
        </div>
      )}

      {status === STATUS.NOT_FOUND && (
        <div className="card">
          <Alert variant="warning">No machine found with ID &quot;{searchedId}&quot;.</Alert>
        </div>
      )}

      {status === STATUS.SUCCESS && machine && (
        <div className="card result-card">
          <PrintHeader title="Machine Details" />
          <div className="result-card__header">
            <span className="result-card__badge">{machine.uniqueId}</span>
            <div className="result-card__actions no-print">
              <button type="button" className="btn btn--secondary" onClick={() => copy(machine.uniqueId)}>
                {copied ? 'Copied!' : 'Copy ID'}
              </button>
              <button type="button" className="btn btn--secondary" onClick={() => window.print()}>
                Print
              </button>
            </div>
          </div>
          <MachineDetailsCard machine={machine} />
        </div>
      )}

      {status === STATUS.IDLE && (
        <div className="card empty-state">
          <p>Enter a machine&apos;s unique ID above to view its registration details.</p>
        </div>
      )}
    </div>
  );
}

export default SearchMachinePage;
