import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import copyIcon from '../../assets/kraken/copy@3x.png';
import expansionIcon from '../../assets/kraken/expansion@3x.png';
import shareIcon from '../../assets/kraken/share@3x.png';
import tronIcon from '../../assets/kraken/tron@3x.png';
import usdtIcon from '../../assets/kraken/usdt@3x.png';
import { ActivityDetail, ActivityItem, activityDetails, baseActivities } from './activityData';
import './krakenActivityDetail.css';
import { KrakenHeader } from './KrakenHeader';

function stripCryptoSign(value: string) {
  return value.replace(/^\+/, '');
}

function maskDepositAddress(value: string) {
  if (value.length <= 20) {
    return value;
  }

  return `${value.slice(0, 11)}...${value.slice(-9)}`;
}

function splitDepositAddress(value: string) {
  return value.match(/.{1,4}/g) ?? [];
}

function sanitizeDepositAddress(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 34);
}

function randomAlphaNumeric(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function randomHex(length: number) {
  const chars = '0123456789abcdef';

  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function randomTransactionNo() {
  const segment = (length: number) => randomAlphaNumeric(length).toUpperCase();

  return `TX${segment(5)}-${segment(5)}-${segment(6)}`;
}

function createMockActivityDetail(depositAddress: string): ActivityDetail {
  return {
    chainTransactionId: `${randomHex(10)}...${randomHex(9)}`,
    depositAddress,
    referenceId: `${randomAlphaNumeric(7)}-${randomAlphaNumeric(4)}...${randomAlphaNumeric(11)}`,
    transactionNo: randomTransactionNo(),
  };
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
  return <img className="kraken-copy-icon" src={copyIcon} alt="" aria-hidden="true" />;
}

function ExternalIcon() {
  return <img className="kraken-external-icon" src={expansionIcon} alt="" aria-hidden="true" />;
}

function ShareIcon() {
  return <img className="kraken-share-icon" src={shareIcon} alt="" aria-hidden="true" />;
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
  const [detailState, setDetailState] = useState<ActivityDetail>(detail);
  const [depositInputValue, setDepositInputValue] = useState(detail.depositAddress);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isDepositAddressSheetOpen, setIsDepositAddressSheetOpen] = useState(false);
  const [hasCopiedDepositAddress, setHasCopiedDepositAddress] = useState(false);
  const depositAddress = detailState.depositAddress;
  const renderedDepositAddress = maskDepositAddress(depositAddress);
  const depositAddressChunks = splitDepositAddress(depositAddress);
  const isDepositInputValid = depositInputValue.length === 34;

  const openDepositDialog = () => {
    setDepositInputValue(depositAddress);
    setIsDepositDialogOpen(true);
  };

  const applyDepositAddress = () => {
    if (!isDepositInputValid) {
      return;
    }

    setDetailState(createMockActivityDetail(depositInputValue));
    setIsDepositDialogOpen(false);
    setIsDepositAddressSheetOpen(false);
    setHasCopiedDepositAddress(false);
  };

  const openDepositAddressSheet = () => {
    setHasCopiedDepositAddress(false);
    setIsDepositAddressSheetOpen(true);
  };

  const copyDepositAddress = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = depositAddress;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    setHasCopiedDepositAddress(true);
  };

  useEffect(() => {
    setDetailState(detail);
    setDepositInputValue(detail.depositAddress);
    setIsDepositDialogOpen(false);
    setIsDepositAddressSheetOpen(false);
    setHasCopiedDepositAddress(false);
  }, [detail]);

  useEffect(() => {
    const themeColor = '#fff';
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
    <main className="kraken-detail-page" aria-label="USDT 活动详情">
      <KrakenHeader className="kraken-detail-header" onBack={() => navigate(-1)} />

      <section className="kraken-detail-hero">
        <img
          className="kraken-detail-token"
          src={usdtIcon}
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
            <img className="kraken-tron-icon" src={tronIcon} alt="" aria-hidden="true" />
            Tron
          </span>
        </DetailRow>
        <DetailRow label="链上交易 ID" valueClassName="kraken-detail-id grey-text content-text">
          <CopyIcon />
          {detailState.chainTransactionId}
        </DetailRow>
        <DetailRow label="存款地址" valueClassName="kraken-detail-id grey-text content-text">
          <button
            className="kraken-inline-icon-button"
            aria-label="查看完整存款地址"
            type="button"
            onClick={openDepositAddressSheet}
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
          {detailState.referenceId}
        </DetailRow>
        <DetailRow label="交易编号" valueClassName="kraken-detail-id content-text">
          <CopyIcon />
          {detailState.transactionNo}
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

      {isDepositAddressSheetOpen && (
        <div
          className="deposit-address-sheet-mask"
          role="presentation"
          onClick={() => setIsDepositAddressSheetOpen(false)}
        >
          <section
            className="deposit-address-sheet"
            aria-label="完整存款地址"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="deposit-address-sheet-handle" aria-hidden="true" />
            <div className="deposit-address-display" aria-label={depositAddress}>
              {depositAddressChunks.map((chunk, index) => (
                <span className="deposit-address-chunk" key={`${chunk}-${index}`}>
                  {chunk.split('').map((character, characterIndex) => (
                    <span
                      className={/\d/.test(character) ? 'deposit-address-number' : undefined}
                      key={`${character}-${characterIndex}`}
                    >
                      {character}
                    </span>
                  ))}
                </span>
              ))}
            </div>
            <button className="deposit-address-copy-button" type="button" onClick={copyDepositAddress}>
              {hasCopiedDepositAddress ? '已复制' : '复制地址'}
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
