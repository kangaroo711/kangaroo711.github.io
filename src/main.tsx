import React from 'react';
import ReactDOM from 'react-dom/client';
import dayjs from 'dayjs';
import { Button } from 'react-vant';
import 'react-vant/lib/index.css';
import './styles.css';
import entryIcon from './assets/entry.png';
import exitIcon from './assets/exit.png';
import eyesIcon from './assets/eyes.png';
import navRightBarIcon from './assets/navRightBar.png';
import noDataIcon from './assets/nodata.png';
import sortIcon from './assets/sort.png';

type RecordType = 'entry' | 'exit';

interface TravelRecord {
  id: number;
  type: RecordType;
  date: string;
  port: string;
  documentType: string;
  documentNo: string;
}

const records: TravelRecord[] = [
  {
    id: 1,
    type: 'exit',
    date: '2024-10-22',
    port: '深圳湾口岸',
    documentType: '普通护照',
    documentNo: 'EK4837402',
  },
  {
    id: 2,
    type: 'entry',
    date: '2024-05-09',
    port: '深圳湾口岸',
    documentType: '普通护照',
    documentNo: 'EK4837402',
  },
  {
    id: 3,
    type: 'exit',
    date: '2024-02-03',
    port: '深圳湾口岸',
    documentType: '普通护照',
    documentNo: 'EK4837402',
  },
  {
    id: 4,
    type: 'entry',
    date: '2023-12-23',
    port: '罗湖口岸',
    documentType: '往来港澳通行证',
    documentNo: 'CC7455944',
  },
  {
    id: 5,
    type: 'exit',
    date: '2023-11-18',
    port: '深圳湾口岸',
    documentType: '往来港澳通行证',
    documentNo: 'CC7455944',
  },
  {
    id: 6,
    type: 'entry',
    date: '2023-08-16',
    port: '罗湖口岸',
    documentType: '往来港澳通行证',
    documentNo: 'CC7455944',
  },
  {
    id: 7,
    type: 'exit',
    date: '2023-08-14',
    port: '福田口岸',
    documentType: '往来港澳通行证',
    documentNo: 'CC7455944',
  },
  {
    id: 8,
    type: 'entry',
    date: '2019-12-21',
    port: '罗湖口岸',
    documentType: '往来港澳通行证',
    documentNo: 'CC7455944',
  },
  {
    id: 9,
    type: 'exit',
    date: '2019-12-21',
    port: '罗湖口岸',
    documentType: '往来港澳通行证',
    documentNo: 'CC7455944',
  },
];

const labelMap: Record<RecordType, string> = {
  entry: '入境',
  exit: '出境',
};

const iconMap: Record<RecordType, string> = {
  entry: entryIcon,
  exit: exitIcon,
};

const periodOptions = [1, 5, 10] as const;

type PeriodYear = (typeof periodOptions)[number];

function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <div className="status-time">8:59</div>
      <div className="status-icons">
        <span className="signal">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="battery">
          <b>75</b>
        </span>
      </div>
    </div>
  );
}

function MiniProgramActions() {
  return (
    <img className="mini-actions" src={navRightBarIcon} alt="" aria-hidden="true" />
  );
}

function FormLabel({ text }: { text: string }) {
  return (
    <span className="form-label">
      <span className="form-label-text">
        {Array.from(text).map((char, index) => (
          <span key={`${char}-${index}`}>{char}</span>
        ))}
      </span>
      <span className="form-label-colon">：</span>
    </span>
  );
}

function RecordCard({ record }: { record: TravelRecord }) {
  const text = labelMap[record.type];

  return (
    <article className={`record-card ${record.type}`}>
      <div className="record-side">
        <img className="plane-icon" src={iconMap[record.type]} alt="" aria-hidden="true" />
        <span>{text}</span>
      </div>
      <div className="record-detail">
        <p>
          <span>{text}时间：</span>
          <strong>{record.date}</strong>
        </p>
        <p>
          <span>{text}口岸：</span>
          <strong>{record.port}</strong>
        </p>
        <p>
          <span>证件类型：</span>
          <strong>{record.documentType}</strong>
        </p>
        <p>
          <span>所持证件号：</span>
          <strong>{record.documentNo}</strong>
        </p>
      </div>
    </article>
  );
}

function App() {
  const [periodYear, setPeriodYear] = React.useState<PeriodYear>(10);

  const dateRange = React.useMemo(() => {
    const endDate = dayjs();
    const startDate = endDate.subtract(periodYear, 'year');

    return {
      startDate,
      endDate,
      text: `${startDate.format('YYYY-MM-DD')} 至 ${endDate.format('YYYY-MM-DD')}`,
    };
  }, [periodYear]);

  const filteredRecords = React.useMemo(() => {
    const startTime = dateRange.startDate.startOf('day').valueOf();
    const endTime = dateRange.endDate.endOf('day').valueOf();

    return records.filter((record) => {
      const recordTime = dayjs(record.date).valueOf();
      return recordTime >= startTime && recordTime <= endTime;
    });
  }, [dateRange]);

  const switchPeriod = () => {
    setPeriodYear((current) => {
      const currentIndex = periodOptions.indexOf(current);
      return periodOptions[(currentIndex + 1) % periodOptions.length];
    });
  };

  return (
    <main className="phone-page">
      <StatusBar />
      <header className="top-bar">
        <button className="back-btn" aria-label="返回" type="button" />
        <h1>出入境记录</h1>
        <MiniProgramActions />
      </header>

      <section className="profile-panel">
        <div className="profile-copy">
          <p>
            <FormLabel text="姓名" />
            <strong>叶*华</strong>
          </p>
          <p>
            <FormLabel text="证件号码" />
            <strong>441***********022</strong>
          </p>
        </div>
        <button className="eye-btn" aria-label="切换证件号码显示" type="button">
          <img src={eyesIcon} alt="" aria-hidden="true" />
        </button>
      </section>

      <section
        className="date-range"
        role="button"
        tabIndex={0}
        aria-label="切换时间段"
        onClick={switchPeriod}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            switchPeriod();
          }
        }}
      >
        <FormLabel text="时间段" />
        <strong>{dateRange.text}</strong>
      </section>

      <section className="result-bar">
        <h2>出入境记录查询结果</h2>
        <div className="result-count">共{filteredRecords.length}条</div>
        <button className="sort-btn" aria-label="排序" type="button">
          <img src={sortIcon} alt="" aria-hidden="true" />
        </button>
      </section>

      <section className={`records-list ${filteredRecords.length === 0 ? 'is-empty' : ''}`} aria-label="出入境记录列表">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))
        ) : (
          <div className="empty-state">
            <img src={noDataIcon} alt="" aria-hidden="true" />
            <p>此时间段内未查询到您的出入境记录</p>
          </div>
        )}
      </section>

      {filteredRecords.length > 0 && (
        <div className="download-wrap">
          <Button block type="primary" className="download-btn">
            记录下载
          </Button>
        </div>
      )}
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
