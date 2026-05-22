import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import noDataIcon from '../../assets/kraken/nodata@3x.png';
import usdtIcon from '../../assets/kraken/usdt@3x.png';
import { ActivityItem, baseActivities, defaultCrypto } from './activityData';
import './kraken.css';
import { KrakenHeader } from './KrakenHeader';

function parseActivityDate(date: string) {
  const match = date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/);

  if (!match) {
    return '';
  }

  const [, year, month, day] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function parseChineseDate(date: string) {
  const match = date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/);

  if (!match) {
    return new Date();
  }

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function parseMoney(value: string) {
  return Number(value.replace(/[$,+\sA-Z]/g, ''));
}

function formatMoney(value: number) {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatCrypto(value: number) {
  return `+${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} USDT`;
}

function formatCryptoInput(value: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatChineseDate(date: Date) {
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日周${weekdays[date.getDay()]}`;
}

function formatFilterDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);

  if (!year || !month || !day) {
    return '';
  }

  return `${year}年${month}月${day}日`;
}

function formatDateFilterLabel(startDate: string, endDate: string) {
  if (startDate && endDate) {
    return `${formatFilterDate(startDate)}至${formatFilterDate(endDate)}`;
  }

  if (startDate) {
    return `${formatFilterDate(startDate)}起`;
  }

  if (endDate) {
    return `截至${formatFilterDate(endDate)}`;
  }

  return '日期';
}

function randomTimeAround(baseDate: string, baseTime: string) {
  const date = parseChineseDate(baseDate);
  const [hours, minutes] = baseTime.split(':').map(Number);
  const offsetMinutes = Math.floor(Math.random() * 361) - 180;
  const nextDate = new Date(date);
  nextDate.setHours(hours, minutes + offsetMinutes, 0, 0);

  return {
    date: formatChineseDate(nextDate),
    time: `${String(nextDate.getHours()).padStart(2, '0')}:${String(nextDate.getMinutes()).padStart(2, '0')}`,
    nextDate,
  };
}

function createActivitiesByCrypto(cryptoValue: number) {
  return baseActivities.map((activity) => {
    const baseFiat = parseMoney(activity.fiat);
    const baseCrypto = parseMoney(activity.crypto);
    const rate = baseFiat / baseCrypto;
    const nextTime = randomTimeAround(activity.date, activity.time);

    // For activities between Feb 2025 and May 2025 (inclusive), reduce USDT by 7%.
    const nextDateObj = nextTime.nextDate;
    // If this activity already has a specific crypto amount (like the small 10 USDT entry id=15),
    // preserve its original amount instead of using the global cryptoValue.
    let appliedCrypto = activity.id === 15 ? baseCrypto : cryptoValue;

    if (nextDateObj && nextDateObj.getFullYear() === 2025) {
      const month = nextDateObj.getMonth() + 1;
      if (month >= 2 && month <= 5) {
        // Do not apply reduction to the special small 10 USDT activity (id 15)
        if (activity.id !== 15) {
          appliedCrypto = +(cryptoValue * 0.93);
        }
      }
    }

    return {
      ...activity,
      date: nextTime.date,
      time: nextTime.time,
      fiat: formatMoney(appliedCrypto * rate),
      crypto: formatCrypto(appliedCrypto),
    };
  });
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
      alt=""
      aria-hidden="true"
      decoding="async"
      draggable={false}
    />
  );
}

function ActivityRow({
  item,
  onAmountClick,
  onRowClick,
}: {
  item: ActivityItem;
  onAmountClick: () => void;
  onRowClick: () => void;
}) {
  return (
    <div
      className="activity-row"
      role="button"
      tabIndex={0}
      onClick={onRowClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onRowClick();
        }
      }}
    >
      <TetherIcon />
      <div className="activity-copy">
        <div className="activity-title">
          存储了 <strong>USDT</strong>
        </div>
        <div className="activity-time">{item.time}</div>
      </div>
      <button
        className="activity-amount"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onAmountClick();
        }}
      >
        <strong>{item.fiat}</strong>
        <span>{item.crypto}</span>
      </button>
    </div>
  );
}

export function KrakenPage() {
  const navigate = useNavigate();
  const [isDatePanelOpen, setIsDatePanelOpen] = useState(false);
  const [isCryptoPanelOpen, setIsCryptoPanelOpen] = useState(false);
  const [activities, setActivities] = useState<ActivityItem[]>(baseActivities);
  const [cryptoValue, setCryptoValue] = useState(parseMoney(defaultCrypto));
  const [cryptoInputValue, setCryptoInputValue] = useState(formatCryptoInput(parseMoney(defaultCrypto)));
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
  }, [activities, startDate, endDate]);

  const hasDateFilter = Boolean(startDate || endDate);
  const dateFilterLabel = formatDateFilterLabel(startDate, endDate);

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setIsDatePanelOpen(false);
  };

  const openCryptoPanel = () => {
    setCryptoInputValue(formatCryptoInput(cryptoValue));
    setIsCryptoPanelOpen(true);
  };

  const openActivityDetail = (item: ActivityItem) => {
    navigate(`/kraken/activity/${item.id}`, { state: { activity: item } });
  };

  const applyCryptoValue = () => {
    const nextCryptoValue = parseMoney(cryptoInputValue);

    if (!Number.isFinite(nextCryptoValue) || nextCryptoValue <= 0) {
      return;
    }

    setCryptoValue(nextCryptoValue);
    setActivities(createActivitiesByCrypto(nextCryptoValue));
    setIsCryptoPanelOpen(false);
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
      <KrakenHeader title="USDT 活动" />

      <section className="kraken-tabs" aria-label="活动分类">
        <button className="active" type="button">主要</button>
        <button type="button">头寸</button>
      </section>

      <section className="kraken-filters" aria-label="筛选条件">
        <button type="button">类型 (1)<span /></button>
        <button
          className={hasDateFilter ? 'date-filter active' : 'date-filter'}
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

      <section className="activity-list" aria-label="USDT 活动列表" >
        {filteredActivities.map((item) => {
          const shouldShowDate = item.date !== currentDate;
          currentDate = item.date;

          return (
            <div className="activity-group" key={`${item.id}-${item.date}-${item.time}-${item.crypto}`}>
              {shouldShowDate && <h2>{item.date}</h2>}
              <ActivityRow
                item={item}
                onAmountClick={openCryptoPanel}
                onRowClick={() => openActivityDetail(item)}
              />
            </div>
          );
        })}
        {filteredActivities.length === 0 && (
          <div className="activity-empty">
            <img
              className="activity-empty-image"
              src={noDataIcon}
              alt=""
              aria-hidden="true"
              decoding="async"
              draggable={false}
            />
            <h2>无交易</h2>
            <p>我们未能根据所应用的筛选找到任何交易。</p>
            <button type="button" onClick={clearFilters}>
              清除筛选
            </button>
          </div>
        )}
      </section>

      {isCryptoPanelOpen && (
        <div className="crypto-dialog-mask" role="presentation" onClick={() => setIsCryptoPanelOpen(false)}>
          <section className="crypto-dialog" aria-label="修改 USDT 数量" onClick={(event) => event.stopPropagation()}>
            <h2>修改 USDT 数量</h2>
            <label>
              <span>Crypto</span>
              <input
                inputMode="decimal"
                value={cryptoInputValue}
                onChange={(event) => setCryptoInputValue(event.target.value)}
                placeholder="4,815.00"
              />
            </label>
            <div className="crypto-dialog-actions">
              <button type="button" onClick={() => setIsCryptoPanelOpen(false)}>取消</button>
              <button type="button" onClick={applyCryptoValue}>确认</button>
            </div>
          </section>
        </div>
      )}

      <footer className="kraken-actions" aria-label="交易操作">
        <button className="recurring" type="button">定期买入</button>
        <button className="trade" type="button">交易</button>
      </footer>
    </main>
  );
}
