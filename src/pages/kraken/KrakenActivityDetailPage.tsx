import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import copyIcon from '../../assets/kraken/copy.png';
import copyIcon3x from '../../assets/kraken/copy@3x.png';
import expansionIcon from '../../assets/kraken/expansion.png';
import expansionIcon3x from '../../assets/kraken/expansion@3x.png';
import shareIcon from '../../assets/kraken/share.png';
import shareIcon3x from '../../assets/kraken/share@3x.png';
import tronIcon from '../../assets/kraken/tron.png';
import tronIcon3x from '../../assets/kraken/tron@3x.png';
import usdtIcon from '../../assets/kraken/usdt.png';
import usdtIcon3x from '../../assets/kraken/usdt@3x.png';
import { ActivityItem, activityDetails, baseActivities } from './activityData';
import './krakenActivityDetail.css';

function stripCryptoSign(value: string) {
  return value.replace(/^\+/, '');
}

function maskDepositAddress(value: string) {
  if (value.length <= 20) {
    return value;
  }

  return `${value.slice(0, 11)}...${value.slice(-9)}`;
}

function sanitizeDepositAddress(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 34);
}

function formatDetailDate(date: string, time: string) {
  const match = date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/);

  if (!match) {
    return `${date} ${time}`;
  }

  const [, year, month, day] = match;
  return `${year}年${month}月${day}日 ${time}`;
}

function CopyIcon() {
  return <img className="kraken-copy-icon" src={copyIcon} srcSet={`${copyIcon} 1x, ${copyIcon3x} 3x`} alt="" aria-hidden="true" />;
}

function ExternalIcon() {
  return <img className="kraken-external-icon" src={expansionIcon} srcSet={`${expansionIcon} 1x, ${expansionIcon3x} 3x`} alt="" aria-hidden="true" />;
}

function ShareIcon() {
  return <img className="kraken-share-icon" src={shareIcon} srcSet={`${shareIcon} 1x, ${shareIcon3x} 3x`} alt="" aria-hidden="true" />;
}

function DetailRow({
  label,
  children,
  valueClassName = '',
}: {
  label: string;
  children: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="kraken-detail-row">
      <div className="kraken-detail-label">{label}</div>
      <div className={`kraken-detail-value ${valueClassName}`.trim()}>{children}</div>
    </div>
  );
}

export function KrakenActivityDetailPage() {
  const navigate = useNavigate();
  const { activityId } = useParams();
  const { state } = useLocation();
  const stateActivity = (state as { activity?: ActivityItem } | null)?.activity;

  const activity = useMemo(() => {
    if (stateActivity) {
      return stateActivity;
    }

    return baseActivities.find((item) => item.id === Number(activityId)) ?? baseActivities[0];
  }, [activityId, stateActivity]);

  const detail = activityDetails[activity.id] ?? activityDetails[1];
  const cryptoAmount = stripCryptoSign(activity.crypto);
  const [depositAddress, setDepositAddress] = useState(detail.depositAddress);
  const [depositInputValue, setDepositInputValue] = useState(detail.depositAddress);
  const [isDepositAddressVisible, setIsDepositAddressVisible] = useState(false);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const renderedDepositAddress = isDepositAddressVisible ? depositAddress : maskDepositAddress(depositAddress);
  const isDepositInputValid = depositInputValue.length === 34;

  const openDepositDialog = () => {
    setDepositInputValue(depositAddress);
    setIsDepositDialogOpen(true);
  };

  const applyDepositAddress = () => {
    if (!isDepositInputValid) {
      return;
    }

    setDepositAddress(depositInputValue);
    setIsDepositAddressVisible(false);
    setIsDepositDialogOpen(false);
  };

  useEffect(() => {
    setDepositAddress(detail.depositAddress);
    setDepositInputValue(detail.depositAddress);
    setIsDepositAddressVisible(false);
    setIsDepositDialogOpen(false);
  }, [detail.depositAddress]);

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
    <main className="kraken-page kraken-detail-page" aria-label="USDT 活动详情">
      <header className="kraken-detail-header">
        <button className="kraken-back" aria-label="返回" type="button" onClick={() => navigate(-1)} />
      </header>

      <section className="kraken-detail-hero">
        <img
          className="kraken-detail-token"
          src={usdtIcon}
          srcSet={`${usdtIcon} 1x, ${usdtIcon3x} 3x`}
          alt=""
          aria-hidden="true"
          decoding="async"
          draggable={false}
        />
        <h1>存储了</h1>
        <strong>{cryptoAmount}</strong>
      </section>

      <section className="kraken-detail-fields" aria-label="交易详情">
        <DetailRow label="总额">
          <strong>{cryptoAmount}</strong>
          <span>≈{activity.fiat}</span>
        </DetailRow>
        <DetailRow label="状态">
          <em className="kraken-success">成功</em>
        </DetailRow>
        <DetailRow label="网络">
          <span className="kraken-network">
            <img className="kraken-tron-icon" src={tronIcon} srcSet={`${tronIcon} 1x, ${tronIcon3x} 3x`} alt="" aria-hidden="true" />
            Tron
          </span>
        </DetailRow>
        <DetailRow label="链上交易 ID" valueClassName="kraken-detail-id grey-text content-text">
          <CopyIcon />
          {detail.chainTransactionId}
        </DetailRow>
        <DetailRow label="存款地址" valueClassName="kraken-detail-id grey-text content-text">
          <button
            className="kraken-inline-icon-button"
            aria-label={isDepositAddressVisible ? '隐藏完整存款地址' : '显示完整存款地址'}
            type="button"
            onClick={() => setIsDepositAddressVisible((value) => !value)}
          >
            <ExternalIcon />
          </button>
          <button className="kraken-deposit-address-button" type="button" onClick={openDepositDialog}>
            {renderedDepositAddress}
          </button>
        </DetailRow>
        <DetailRow label="日期">
          <strong>{formatDetailDate(activity.date, activity.time)}</strong>
        </DetailRow>
        <DetailRow label="参考 ID" valueClassName="kraken-detail-id content-text">
          <CopyIcon />
          {detail.referenceId}
        </DetailRow>
        <DetailRow label="交易编号" valueClassName="kraken-detail-id content-text">
          <CopyIcon />
          {detail.transactionNo}
        </DetailRow>
      </section>

      <section className="kraken-detail-footer">
        <button type="button">
          查看区块链浏览器
          <ShareIcon />
        </button>
        <p>以您首选货币显示的总金额是基于交易当天的汇率估算的。</p>
      </section>

      {isDepositDialogOpen && (
        <div className="deposit-dialog-mask" role="presentation" onClick={() => setIsDepositDialogOpen(false)}>
          <section className="deposit-dialog" aria-label="修改存款地址" onClick={(event) => event.stopPropagation()}>
            <h2>修改存款地址</h2>
            <label>
              <span>存款地址</span>
              <input
                inputMode="text"
                maxLength={34}
                value={depositInputValue}
                onChange={(event) => setDepositInputValue(sanitizeDepositAddress(event.target.value))}
                placeholder="请输入34位英文和数字"
              />
            </label>
            <p>{depositInputValue.length}/34，仅支持英文和数字</p>
            <div className="deposit-dialog-actions">
              <button type="button" onClick={() => setIsDepositDialogOpen(false)}>取消</button>
              <button type="button" disabled={!isDepositInputValid} onClick={applyDepositAddress}>确认</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
