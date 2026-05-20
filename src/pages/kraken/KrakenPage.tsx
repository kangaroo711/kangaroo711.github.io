import { useEffect, useMemo, useState } from 'react';
import usdtIcon from '../../assets/kraken/usdt.png';
import usdtIcon3x from '../../assets/kraken/usdt@3x.png';
import './kraken.css';

interface ActivityItem {
  id: number;
  date: string;
  title: string;
  time: string;
  fiat: string;
  crypto: string;
}

const activities: ActivityItem[] = [
  { id: 1, date: '2026年5月15日周五', title: '存储了 USDT', 5: '23:04', fiat: '$4,812.88', crypto: '+4,815.00 USDT' },
  { id: 2, date: '2026年5月15日周五', title: '存储了 USDT', time: '22:03', fiat: '$4,811.97', crypto: '+4,815.00 USDT' },
  { id: 3, date: '2026年4月14日周二', title: '存储了 USDT', time: '19:08', fiat: '$4,823.25', crypto: '+4,815.00 USDT' },
  { id: 4, date: '2026年3月13日周五', title: '存储了 USDT', time: '20:34', fiat: '$4,801.64', crypto: '+4,815.00 USDT' },
  { id: 5, date: '2026年2月13日周五', title: '存储了 USDT', time: '20:29', fiat: '$4,820.92', crypto: '+4,815.00 USDT' },
  { id: 6, date: '2026年1月15日周四', title: '存储了 USDT', time: '19:47', fiat: '$4,842.31', crypto: '+4,815.00 USDT' },
  { id: 7, date: '2025年12月19日周五', title: '存储了 USDT', time: '02:39', fiat: '$4,802.33', crypto: '+4,815.00 USDT' },
  { id: 8, date: '2025年11月17日周一', title: '存储了 USDT', time: '17:55', fiat: '$4,824.14', crypto: '+4,815.00 USDT' },
  { id: 9, date: '2025年10月16日周四', title: '存储了 USDT', time: '15:18', fiat: '$4,811.97', crypto: '+4,815.00 USDT' },
  { id: 10, date: '2025年9月16日周二', title: '存储了 USDT', time: '17:08', fiat: '$4,813.94', crypto: '+4,815.00 USDT' },
  { id: 11, date: '2025年7月18日周五', title: '存储了 USDT', time: '18:38', fiat: '$4,816.11', crypto: '+4,815.00 USDT' },
  { id: 12, date: '2025年5月21日周三', title: '存储了 USDT', time: '22:12', fiat: '$4,815.48', crypto: '+4,815.00 USDT' },
  { id: 13, date: '2025年4月17日周四', title: '存储了 USDT', time: '19:22', fiat: '$4,812.99', crypto: '+4,815.00 USDT' },
  { id: 14, date: '2025年3月18日周二', title: '存储了 USDT', time: '16:16', fiat: '$4,814.71', crypto: '+4,815.00 USDT' },
  { id: 15, date: '2025年2月20日周四', title: '存储了 USDT', time: '19:39', fiat: '$4,814.81', crypto: '+4,815.00 USDT' },
  { id: 16, date: '2025年2月20日周四', title: '存储了 USDT', time: '18:41', fiat: '$20.00', crypto: '+10.00 USDT' },
  { id: 16, date: '2025年2月20日周四', title: '存储了 USDT', time: '18:41', fiat: '$40.00', crypto: '+20.00 USDT' },
];

function parseActivityDate(date: string) {
  const match = date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/);

  if (!match) {
    return '';
  }

  const [, year, month, day] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function KrakenStatusBar() {
  return (
    <div className="kraken-status" aria-hidden="true">
      <div className="kraken-status-left">
        <span>2:07</span>
        <b>3</b>
      </div>
      <div className="kraken-status-right">
        <span className="kraken-key" />
        <span className="kraken-lock" />
        <span className="kraken-muted" />
        <span className="kraken-hd">HD</span>
        <span className="kraken-lte">LTE</span>
        <span className="kraken-bars" />
        <span className="kraken-percent">100%</span>
        <span className="kraken-battery" />
      </div>
    </div>
  );
}

function TetherIcon() {
  return (
    <img
      className="tether-icon"
      src={usdtIcon}
      srcSet={`${usdtIcon} 1x, ${usdtIcon3x} 3x`}
      alt=""
      aria-hidden="true"
      decoding="async"
      draggable={false}
    />
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  return (
    <div className="activity-row">
      <TetherIcon />
      <div className="activity-copy">
        <div className="activity-title">
          存储了 <strong>USDT</strong>
        </div>
        <div className="activity-time">{item.time}</div>
      </div>
      <div className="activity-amount">
        <strong>{item.fiat}</strong>
        <span>{item.crypto}</span>
      </div>
    </div>
  );
}

export function KrakenPage() {
  const [isDatePanelOpen, setIsDatePanelOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  let currentDate = '';

  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      const itemDate = parseActivityDate(item.date);

      if (!itemDate) {
        return true;
      }

      if (startDate && itemDate < startDate) {
        return false;
      }

      if (endDate && itemDate > endDate) {
        return false;
      }

      return true;
    });
  }, [startDate, endDate]);

  const hasDateFilter = Boolean(startDate || endDate);
  const dateFilterLabel = hasDateFilter ? '日期 (1)' : '日期';

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setIsDatePanelOpen(false);
  };

  useEffect(() => {
    const themeColor = '#f6f5f9';
    let metaThemeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }

    const previousThemeColor = metaThemeColor.content;
    metaThemeColor.content = themeColor;

    return () => {
      metaThemeColor.content = previousThemeColor || '#f3f3f3';
    };
  }, []);

  return (
    <main className="kraken-page" aria-label="USDT 活动">
      {/* <KrakenStatusBar /> */}
      <header className="kraken-header">
        <button className="kraken-back" aria-label="返回" type="button" />
        <h1>USDT 活动</h1>
      </header>

      <section className="kraken-tabs" aria-label="活动分类">
        <button className="active" type="button">主要</button>
        <button type="button">买寸</button>
      </section>

      <section className="kraken-filters" aria-label="筛选条件">
        <button type="button">类型 (1)<span /></button>
        <button
          className={hasDateFilter ? 'active' : ''}
          type="button"
          onClick={() => setIsDatePanelOpen((value) => !value)}
        >
          {dateFilterLabel}<span />
        </button>
        <button className="clear" type="button" onClick={clearFilters}>清除</button>
      </section>

      {isDatePanelOpen && (
        <section className="date-filter-panel" aria-label="日期筛选">
          <label>
            <span>开始时间</span>
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </label>
          <label>
            <span>结束时间</span>
            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </label>
          <div className="date-filter-actions">
            <button type="button" onClick={clearFilters}>重置</button>
            <button type="button" onClick={() => setIsDatePanelOpen(false)}>完成</button>
          </div>
        </section>
      )}

      <section className="activity-list" aria-label="USDT 活动列表">
        {filteredActivities.map((item) => {
          const shouldShowDate = item.date !== currentDate;
          currentDate = item.date;

          return (
            <div className="activity-group" key={item.id}>
              {shouldShowDate && <h2>{item.date}</h2>}
              <ActivityRow item={item} />
            </div>
          );
        })}
        {filteredActivities.length === 0 && (
          <div className="activity-empty">当前日期范围内暂无活动</div>
        )}
      </section>

      <footer className="kraken-actions" aria-label="交易操作">
        <button className="recurring" type="button">定期买入</button>
        <button className="trade" type="button">交易</button>
      </footer>
    </main>
  );
}
