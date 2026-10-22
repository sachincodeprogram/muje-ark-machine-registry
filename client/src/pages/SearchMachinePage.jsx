import { useState } from 'react';

import { fetchMachineBySerialNumber, fetchMachineByUniqueId } from '../api/machines';
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

const SEARCH_MODES = {
  id: {
    label: 'ARK ID',
    inputLabel: 'Machine unique ID',
    placeholder: 'ARK-20260730-AB12',
    emptyError: 'Enter a unique ID to search.',
    notFound: 'No machine found with ID',
    idleHint: "Enter a machine's unique ID above to view its registration details.",
    fetch: fetchMachineByUniqueId,
  },
  serial: {
    label: 'Serial Number',
    inputLabel: 'Machine serial number',
    placeholder: 'SN-4587-XK',
    emptyError: 'Enter a serial number to search.',
    notFound: 'No machine found with serial number',
    idleHint: "Enter a machine's serial number above to view its registration details.",
    fetch: fetchMachineBySerialNumber,
  },
};

function SearchMachinePage() {
  const [mode, setMode] = useState('id');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState(STATUS.IDLE);
  const [machine, setMachine] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchedId, setSearchedId] = useState('');
  const [copied, copy] = useClipboard();
  const searchMode = SEARCH_MODES[mode];

  function handleModeChange(nextMode) {
    if (nextMode === mode) {
      return;
    }
    setMode(nextMode);
    setQuery('');
    setMachine(null);
    setErrorMessage('');
    setStatus(STATUS.IDLE);
  }

  async function handleSearch(event) {
    event.preventDefault();

    const trimmedId = query.trim().toUpperCase();
    if (!trimmedId) {
      setStatus(STATUS.ERROR);
      setErrorMessage(searchMode.emptyError);
      return;
    }

    setStatus(STATUS.LOADING);
    setErrorMessage('');
    setSearchedId(trimmedId);

    try {
      const data = await searchMode.fetch(trimmedId);
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
        <p>Look up a registered machine using its ARK unique ID or serial number.</p>
      </div>

      <div className="card no-print">
        <div className="search-mode" role="group" aria-label="Search by">
          {Object.entries(SEARCH_MODES).map(([key, option]) => (
            <button
              key={key}
              type="button"
              className={`search-mode__option${mode === key ? ' search-mode__option--active' : ''}`}
              aria-pressed={mode === key}
              onClick={() => handleModeChange(key)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <form className="search-bar" onSubmit={handleSearch}>
          <label htmlFor="searchQuery" className="visually-hidden">
            {searchMode.inputLabel}
          </label>
          <input
            id="searchQuery"
            name="searchQuery"
            type="text"
            className="form-input search-bar__input"
            placeholder={searchMode.placeholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
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
          <Alert variant="warning">
            {searchMode.notFound} &quot;{searchedId}&quot;.
          </Alert>
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
          <p>{searchMode.idleHint}</p>
        </div>
      )}
    </div>
  );
}

export default SearchMachinePage;
