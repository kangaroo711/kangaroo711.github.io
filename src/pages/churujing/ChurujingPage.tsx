import React from "react";
import dayjs from "dayjs";
import { Button, Calendar } from "react-vant";
import "./churujing.css";
import entryIcon from "../../assets/churujing/entry@3x.png";
import exitIcon from "../../assets/churujing/exit@3x.png";
import eyesIcon from "../../assets/churujing/eyes@3x.png";
import navRightBarIcon from "../../assets/churujing/navRightBar@3x.png";
import noDataIcon from "../../assets/churujing/nodata@3x.png";
import sortIcon from "../../assets/churujing/sort@3x.png";

type RecordType = "entry" | "exit";

interface TravelRecord {
  id: number;
  type: RecordType;
  date: string;
  port: string;
  documentType: string;
  documentNo: string;
}

interface RecordDraft extends TravelRecord {
  portMode: string;
  customPort: string;
  documentTypeMode: string;
  customDocumentType: string;
}

const initialRecords: TravelRecord[] = [
  { id: 1, type: "exit", date: "2024-10-22", port: "深圳湾口岸", documentType: "普通护照", documentNo: "EK4837402" },
  { id: 2, type: "entry", date: "2024-05-09", port: "深圳湾口岸", documentType: "普通护照", documentNo: "EK4837402" },
  { id: 3, type: "exit", date: "2024-02-03", port: "深圳湾口岸", documentType: "普通护照", documentNo: "EK4837402" },
  {
    id: 4,
    type: "entry",
    date: "2023-12-23",
    port: "罗湖口岸",
    documentType: "往来港澳通行证",
    documentNo: "CC7455944",
  },
  {
    id: 5,
    type: "exit",
    date: "2023-11-18",
    port: "深圳湾口岸",
    documentType: "往来港澳通行证",
    documentNo: "CC7455944",
  },
  {
    id: 6,
    type: "entry",
    date: "2023-08-16",
    port: "罗湖口岸",
    documentType: "往来港澳通行证",
    documentNo: "CC7455944",
  },
  {
    id: 7,
    type: "exit",
    date: "2023-08-14",
    port: "福田口岸",
    documentType: "往来港澳通行证",
    documentNo: "CC7455944",
  },
  {
    id: 8,
    type: "exit",
    date: "2019-12-21",
    port: "罗湖口岸",
    documentType: "往来港澳通行证",
    documentNo: "CC7455944",
  },
  {
    id: 9,
    type: "entry",
    date: "2019-12-21",
    port: "罗湖口岸",
    documentType: "往来港澳通行证",
    documentNo: "CC7455944",
  },
];

const labelMap: Record<RecordType, string> = {
  entry: "入境",
  exit: "出境",
};

const iconMap: Record<RecordType, string> = {
  entry: entryIcon,
  exit: exitIcon,
};

type EditableField = "name" | "documentNo";
type PeriodKey = "custom" | "3m" | "1y" | "5y" | "10y";
type SortDirection = "desc" | "asc";

const idCardWeights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
const idCardCheckCodes = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
const minQueryDate = dayjs("2007-01-01");

const periodOptions: Array<{ key: PeriodKey; label: string }> = [
  { key: "custom", label: "自定义" },
  { key: "3m", label: "三个月" },
  { key: "1y", label: "1年" },
  { key: "5y", label: "5年" },
  { key: "10y", label: "10年" },
];

const customOptionValue = "__custom__";

const shenzhenPortOptions = [
  "深圳湾口岸",
  "罗湖口岸",
  "福田口岸",
  "皇岗口岸",
  "文锦渡口岸",
  "莲塘口岸",
  "蛇口邮轮中心",
  "深圳机场口岸",
  "沙头角口岸",
  "深圳湾港口岸",
];

const documentTypeOptions = ["普通护照", "往来港澳通行证", "往来台湾通行证", "港澳居民来往内地通行证"];
const minMockRecordDate = dayjs("2017-01-01");

interface IconImageProps {
  className: string;
  src: string;
  label?: string;
}

function IconImage({ className, src, label }: IconImageProps) {
  return (
    <img
      className={`asset-icon ${className}`}
      src={src}
      alt={label ?? ""}
      aria-hidden={label ? undefined : true}
      decoding="async"
      draggable={false}
    />
  );
}

function MiniProgramActions() {
  return <IconImage className="mini-actions" src={navRightBarIcon} />;
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

function maskName(name: string) {
  const chars = Array.from(name.trim());

  if (chars.length <= 1) {
    return name;
  }

  if (chars.length === 2) {
    return `${chars[0]}*`;
  }

  return `${chars[0]}${"*".repeat(chars.length - 2)}${chars[chars.length - 1]}`;
}

function maskDocumentNo(documentNo: string) {
  const text = documentNo.trim();

  if (text.length <= 4) {
    return text.replace(/.(?=.)/g, "*");
  }

  if (text.length <= 8) {
    return `${text.slice(0, 2)}${"*".repeat(text.length - 4)}${text.slice(-2)}`;
  }

  return `${text.slice(0, 3)}${"*".repeat(text.length - 6)}${text.slice(-3)}`;
}

function validateProfileName(name: string) {
  if (!/^[\u4e00-\u9fa5]{2,4}$/.test(name)) {
    return "姓名需输入2-4位中文";
  }

  return "";
}

function validateIdCard(documentNo: string) {
  const value = documentNo.toUpperCase();

  if (!/^\d{17}[\dX]$/.test(value)) {
    return "身份证号码需为18位，末位可为数字或X";
  }

  const birthDate = value.slice(6, 14);
  const year = Number(birthDate.slice(0, 4));
  const month = Number(birthDate.slice(4, 6));
  const day = Number(birthDate.slice(6, 8));
  const birth = new Date(year, month - 1, day);
  const today = new Date();

  if (
    birth.getFullYear() !== year ||
    birth.getMonth() !== month - 1 ||
    birth.getDate() !== day ||
    birth.getTime() > today.getTime()
  ) {
    return "身份证号码中的出生日期无效";
  }

  const sum = idCardWeights.reduce((total, weight, index) => total + Number(value[index]) * weight, 0);
  const expectedCheckCode = idCardCheckCodes[sum % 11];

  if (value[17] !== expectedCheckCode) {
    return "身份证号码校验码错误";
  }

  return "";
}

function normalizeDraftValue(field: EditableField, value: string) {
  if (field === "name") {
    return Array.from(value)
      .filter((char) => /^[\u4e00-\u9fa5]$/.test(char))
      .slice(0, 4)
      .join("");
  }

  return value
    .toUpperCase()
    .replace(/[^0-9X]/g, "")
    .slice(0, 18);
}

function clampStartDate(date: dayjs.Dayjs) {
  return date.isBefore(minQueryDate, "day") ? minQueryDate : date;
}

function getQuickDateRange(period: Exclude<PeriodKey, "custom">) {
  const endDate = dayjs();
  const subtractMap = {
    "3m": { amount: 3, unit: "month" },
    "1y": { amount: 1, unit: "year" },
    "5y": { amount: 5, unit: "year" },
    "10y": { amount: 10, unit: "year" },
  } as const;
  const option = subtractMap[period];
  const startDate = clampStartDate(endDate.subtract(option.amount, option.unit));

  return { startDate, endDate };
}

function getNextRecordType(records: TravelRecord[], index: number): RecordType {
  const lastType =
    records.length > 0 ? records[records.length - 1].type : initialRecords[initialRecords.length - 1].type;

  if (index === 0) {
    return lastType === "entry" ? "exit" : "entry";
  }

  return index % 2 === 0 ? (lastType === "entry" ? "exit" : "entry") : lastType;
}

function getMockRecordDate(index: number, dateRange: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs }) {
  const minDate = dateRange.startDate.isBefore(minMockRecordDate, "day") ? minMockRecordDate : dateRange.startDate;
  const maxDate = dateRange.endDate.isBefore(minDate, "day") ? minDate : dateRange.endDate;
  const nextDate = maxDate.subtract(index * 45, "day");

  return (nextDate.isBefore(minDate, "day") ? minDate : nextDate).format("YYYY-MM-DD");
}

function createMockRecords(
  records: TravelRecord[],
  count: number,
  dateRange: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs },
) {
  const maxId = records.reduce((id, record) => Math.max(id, record.id), 0);

  return Array.from({ length: count }, (_, index) => {
    const type = getNextRecordType(records, index);
    const optionIndex = (records.length + index) % shenzhenPortOptions.length;

    return {
      id: maxId + index + 1,
      type,
      date: getMockRecordDate(index, dateRange),
      port: shenzhenPortOptions[optionIndex],
      documentType: documentTypeOptions[optionIndex % documentTypeOptions.length],
      documentNo: type === "entry" ? "CC7455944" : "EK4837402",
    };
  });
}

function createRecordDraft(record: TravelRecord): RecordDraft {
  const hasPortOption = shenzhenPortOptions.includes(record.port);
  const hasDocumentTypeOption = documentTypeOptions.includes(record.documentType);

  return {
    ...record,
    portMode: hasPortOption ? record.port : customOptionValue,
    customPort: hasPortOption ? "" : record.port,
    documentTypeMode: hasDocumentTypeOption ? record.documentType : customOptionValue,
    customDocumentType: hasDocumentTypeOption ? "" : record.documentType,
  };
}

function resolveRecordDraft(draft: RecordDraft): TravelRecord {
  return {
    id: draft.id,
    type: draft.type,
    date: draft.date,
    port: (draft.portMode === customOptionValue ? draft.customPort : draft.portMode).trim(),
    documentType: (draft.documentTypeMode === customOptionValue
      ? draft.customDocumentType
      : draft.documentTypeMode
    ).trim(),
    documentNo: draft.documentNo.trim().toUpperCase(),
  };
}

function RecordCard({ record, onEdit }: { record: TravelRecord; onEdit: (record: TravelRecord) => void }) {
  const text = labelMap[record.type];

  return (
    <article
      className={`record-card ${record.type}`}
      role="button"
      tabIndex={0}
      aria-label={`编辑${text}记录`}
      onClick={() => onEdit(record)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onEdit(record);
        }
      }}
    >
      <div className="record-side">
        <IconImage className="plane-icon" src={iconMap[record.type]} />
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
          <strong>{maskDocumentNo(record.documentNo)}</strong>
        </p>
      </div>
    </article>
  );
}

export function ChurujingPage() {
  const defaultDateRange = React.useMemo(() => getQuickDateRange("10y"), []);
  const [records, setRecords] = React.useState(initialRecords);
  const [selectedPeriod, setSelectedPeriod] = React.useState<PeriodKey>("10y");
  const [dateRange, setDateRange] = React.useState(defaultDateRange);
  const [isPeriodSheetOpen, setIsPeriodSheetOpen] = React.useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [recordDraft, setRecordDraft] = React.useState<RecordDraft | null>(null);
  const [recordDraftError, setRecordDraftError] = React.useState("");
  const [isRecordDateCalendarOpen, setIsRecordDateCalendarOpen] = React.useState(false);
  const [isCountEditorOpen, setIsCountEditorOpen] = React.useState(false);
  const [countDraftValue, setCountDraftValue] = React.useState(String(initialRecords.length));
  const [countDraftError, setCountDraftError] = React.useState("");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("desc");
  const [profileName, setProfileName] = React.useState("叶建华");
  const [profileDocumentNo, setProfileDocumentNo] = React.useState("441302198901230021");
  const [editingField, setEditingField] = React.useState<EditableField | null>(null);
  const [draftValue, setDraftValue] = React.useState("");
  const [draftError, setDraftError] = React.useState("");
  const [isComposingName, setIsComposingName] = React.useState(false);

  React.useEffect(() => {
    const themeColor = "#fff";
    let metaThemeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.name = "theme-color";
      document.head.appendChild(metaThemeColor);
    }

    const previousThemeColor = metaThemeColor.content;
    metaThemeColor.content = themeColor;

    return () => {
      metaThemeColor.content = previousThemeColor || "#f3f3f3";
    };
  }, []);

  const dateRangeText = `${dateRange.startDate.format("YYYY-MM-DD")} 至 ${dateRange.endDate.format("YYYY-MM-DD")}`;

  const filteredRecords = React.useMemo(() => {
    const startTime = dateRange.startDate.startOf("day").valueOf();
    const endTime = dateRange.endDate.endOf("day").valueOf();

    return records
      .filter((record) => {
        const recordTime = dayjs(record.date).valueOf();
        return recordTime >= startTime && recordTime <= endTime;
      })
      .sort((recordA, recordB) => {
        const timeA = dayjs(recordA.date).valueOf();
        const timeB = dayjs(recordB.date).valueOf();

        if (timeA === timeB) {
          return sortDirection === "desc" ? recordB.id - recordA.id : recordA.id - recordB.id;
        }

        return sortDirection === "desc" ? timeB - timeA : timeA - timeB;
      });
  }, [dateRange, records, sortDirection]);

  const selectQuickPeriod = (period: PeriodKey) => {
    if (period === "custom") {
      setIsPeriodSheetOpen(false);
      setIsCalendarOpen(true);
      return;
    }

    setSelectedPeriod(period);
    setDateRange(getQuickDateRange(period));
    setIsPeriodSheetOpen(false);
  };

  const confirmCustomDateRange = (value: Date | Date[]) => {
    if (!Array.isArray(value) || value.length < 2) {
      return;
    }

    const [startDate, endDate] = value;

    setSelectedPeriod("custom");
    setDateRange({
      startDate: dayjs(startDate),
      endDate: dayjs(endDate),
    });
    setIsCalendarOpen(false);
  };

  const openRecordEditor = (record: TravelRecord) => {
    setRecordDraft(createRecordDraft(record));
    setRecordDraftError("");
  };

  const closeRecordEditor = () => {
    setRecordDraft(null);
    setRecordDraftError("");
    setIsRecordDateCalendarOpen(false);
  };

  const updateRecordDraft = (patch: Partial<RecordDraft>) => {
    setRecordDraft((current) => (current ? { ...current, ...patch } : current));
    setRecordDraftError("");
  };

  const updateRecordDocumentType = (documentTypeMode: string) => {
    setRecordDraft((current) => {
      if (!current) {
        return current;
      }

      const documentType =
        documentTypeMode === customOptionValue ? current.customDocumentType.trim() : documentTypeMode;
      const matchedRecord = filteredRecords.find((record) => record.documentType === documentType);

      return {
        ...current,
        documentTypeMode,
        documentNo: matchedRecord?.documentNo ?? "",
      };
    });
    setRecordDraftError("");
  };

  const confirmRecordDate = (value: Date | Date[]) => {
    if (Array.isArray(value)) {
      return;
    }

    updateRecordDraft({ date: dayjs(value).format("YYYY-MM-DD") });
    setIsRecordDateCalendarOpen(false);
  };

  const confirmRecordEditor = () => {
    if (!recordDraft) {
      return;
    }

    const nextRecord = resolveRecordDraft(recordDraft);

    if (!nextRecord.port) {
      setRecordDraftError("请选择或输入口岸");
      return;
    }

    if (!nextRecord.documentType) {
      setRecordDraftError("请选择或输入证件类型");
      return;
    }

    if (!nextRecord.documentNo) {
      setRecordDraftError("请输入证件号");
      return;
    }

    setRecords((current) =>
      current.map((record) => {
        if (record.id === nextRecord.id) {
          return nextRecord;
        }

        if (record.documentType === nextRecord.documentType) {
          return { ...record, documentNo: nextRecord.documentNo };
        }

        return record;
      }),
    );
    closeRecordEditor();
  };

  const openCountEditor = () => {
    setCountDraftValue(String(filteredRecords.length));
    setCountDraftError("");
    setIsCountEditorOpen(true);
  };

  const closeCountEditor = () => {
    setIsCountEditorOpen(false);
    setCountDraftError("");
  };

  const confirmCountEditor = () => {
    const nextCount = Number(countDraftValue);

    if (!Number.isInteger(nextCount) || nextCount < 0) {
      setCountDraftError("请输入不小于0的整数");
      return;
    }

    setRecords((current) => {
      if (nextCount < filteredRecords.length) {
        const removeIds = new Set(filteredRecords.slice(nextCount).map((record) => record.id));
        return current.filter((record) => !removeIds.has(record.id));
      }

      if (nextCount > filteredRecords.length) {
        return [...current, ...createMockRecords(current, nextCount - filteredRecords.length, dateRange)];
      }

      return current;
    });
    closeCountEditor();
  };

  const toggleSortDirection = () => {
    setSortDirection((current) => (current === "desc" ? "asc" : "desc"));
  };

  const openEditor = (field: EditableField) => {
    setEditingField(field);
    setDraftValue(field === "name" ? profileName : profileDocumentNo);
    setDraftError("");
  };

  const closeEditor = () => {
    setEditingField(null);
    setDraftValue("");
    setDraftError("");
    setIsComposingName(false);
  };

  const confirmEditor = () => {
    const nextValue = draftValue.trim().toUpperCase();

    if (!editingField) {
      return;
    }

    const nextError = editingField === "name" ? validateProfileName(nextValue) : validateIdCard(nextValue);

    if (nextError) {
      setDraftError(nextError);
      return;
    }

    if (editingField === "name") {
      setProfileName(nextValue);
    } else {
      setProfileDocumentNo(nextValue);
    }

    closeEditor();
  };

  const editorTitle = editingField === "name" ? "修改姓名" : "修改证件号码";

  return (
    <main className="phone-page">
      <header className="top-bar">
        <button className="back-btn" aria-label="返回" type="button" />
        <h1>出入境记录</h1>
        <MiniProgramActions />
      </header>

      <section className="profile-panel">
        <div className="profile-copy">
          <p>
            <FormLabel text="姓名" />
            <button className="profile-value" type="button" onClick={() => openEditor("name")}>
              {maskName(profileName)}
            </button>
          </p>
          <p>
            <FormLabel text="证件号码" />
            <button className="profile-value" type="button" onClick={() => openEditor("documentNo")}>
              {maskDocumentNo(profileDocumentNo)}
            </button>
          </p>
        </div>
        <button className="eye-btn" aria-label="切换证件号码显示" type="button">
          <IconImage className="eye-icon" src={eyesIcon} />
        </button>
      </section>

      <section
        className="date-range"
        role="button"
        tabIndex={0}
        aria-label="选择时间段"
        onClick={() => setIsPeriodSheetOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsPeriodSheetOpen(true);
          }
        }}
      >
        <FormLabel text="时间段" />
        <strong>{dateRangeText}</strong>
      </section>

      <section
        className="result-bar"
        role="button"
        tabIndex={0}
        aria-label="修改记录数量"
        onClick={openCountEditor}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openCountEditor();
          }
        }}
      >
        <h2>出入境记录查询结果</h2>
        <div className="result-count">共{filteredRecords.length}条</div>
        <button
          className={`sort-btn ${sortDirection === "asc" ? "is-asc" : ""}`}
          aria-label={sortDirection === "desc" ? "当前按日期降序，点击切换升序" : "当前按日期升序，点击切换降序"}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toggleSortDirection();
          }}
        >
          <IconImage className="sort-icon" src={sortIcon} />
        </button>
      </section>

      <section className={`records-list ${filteredRecords.length === 0 ? "is-empty" : ""}`} aria-label="出入境记录列表">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => <RecordCard key={record.id} record={record} onEdit={openRecordEditor} />)
        ) : (
          <div className="empty-state">
            <img
              className="empty-state-image"
              src={noDataIcon}
              alt=""
              aria-hidden="true"
              decoding="async"
              draggable={false}
            />
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

      {editingField && (
        <div className="edit-mask" role="presentation" onClick={closeEditor}>
          <section
            className="edit-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-edit-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="profile-edit-title">{editorTitle}</h2>
            <input
              className="edit-input"
              value={draftValue}
              autoFocus
              inputMode={editingField === "documentNo" ? "text" : undefined}
              maxLength={editingField === "name" ? 4 : 18}
              aria-invalid={draftError ? true : undefined}
              aria-describedby={draftError ? "profile-edit-error" : undefined}
              onCompositionStart={() => {
                if (editingField === "name") {
                  setIsComposingName(true);
                }
              }}
              onCompositionEnd={(event) => {
                if (editingField === "name") {
                  setIsComposingName(false);
                  setDraftValue(normalizeDraftValue(editingField, event.currentTarget.value));
                }
              }}
              onChange={(event) => {
                setDraftValue(
                  editingField === "name" && isComposingName
                    ? event.target.value
                    : normalizeDraftValue(editingField, event.target.value),
                );
                setDraftError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  confirmEditor();
                }

                if (event.key === "Escape") {
                  closeEditor();
                }
              }}
            />
            {draftError && (
              <p className="edit-error" id="profile-edit-error">
                {draftError}
              </p>
            )}
            <div className="edit-actions">
              <button className="edit-action edit-cancel" type="button" onClick={closeEditor}>
                取消
              </button>
              <button className="edit-action edit-confirm" type="button" onClick={confirmEditor}>
                确定
              </button>
            </div>
          </section>
        </div>
      )}

      {isPeriodSheetOpen && (
        <div className="sheet-mask" role="presentation" onClick={() => setIsPeriodSheetOpen(false)}>
          <section
            className="period-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="period-sheet-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="period-sheet-title">选择时间段</h2>
            <div className="period-options">
              {periodOptions.map((option) => (
                <button
                  className={`period-option ${selectedPeriod === option.key ? "is-active" : ""}`}
                  type="button"
                  key={option.key}
                  onClick={() => selectQuickPeriod(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button className="period-cancel" type="button" onClick={() => setIsPeriodSheetOpen(false)}>
              取消
            </button>
          </section>
        </div>
      )}

      {recordDraft && (
        <div className="edit-mask" role="presentation" onClick={closeRecordEditor}>
          <section
            className="edit-dialog record-edit-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="record-edit-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="record-edit-title">修改出入境记录</h2>
            <div className="record-form">
              <div className="record-field">
                <span>出入境类型</span>
                <div className="record-type-switch" role="group" aria-label="出入境类型">
                  <button
                    className={`record-type-option ${recordDraft.type === "entry" ? "is-active" : ""}`}
                    type="button"
                    onClick={() => updateRecordDraft({ type: "entry" })}
                  >
                    入境
                  </button>
                  <button
                    className={`record-type-option ${recordDraft.type === "exit" ? "is-active" : ""}`}
                    type="button"
                    onClick={() => updateRecordDraft({ type: "exit" })}
                  >
                    出境
                  </button>
                </div>
              </div>

              <div className="record-field">
                <span>时间</span>
                <button className="record-date-button" type="button" onClick={() => setIsRecordDateCalendarOpen(true)}>
                  {recordDraft.date}
                </button>
              </div>

              <label className="record-field">
                <span>口岸</span>
                <select
                  className="record-control"
                  value={recordDraft.portMode}
                  onChange={(event) => updateRecordDraft({ portMode: event.target.value })}
                >
                  {shenzhenPortOptions.map((port) => (
                    <option key={port} value={port}>
                      {port}
                    </option>
                  ))}
                  <option value={customOptionValue}>自定义输入</option>
                </select>
              </label>
              {recordDraft.portMode === customOptionValue && (
                <input
                  className="record-control record-custom-input"
                  value={recordDraft.customPort}
                  placeholder="请输入口岸"
                  onChange={(event) => updateRecordDraft({ customPort: event.target.value })}
                />
              )}

              <label className="record-field">
                <span>证件类型</span>
                <select
                  className="record-control"
                  value={recordDraft.documentTypeMode}
                  onChange={(event) => updateRecordDocumentType(event.target.value)}
                >
                  {documentTypeOptions.map((documentType) => (
                    <option key={documentType} value={documentType}>
                      {documentType}
                    </option>
                  ))}
                  <option value={customOptionValue}>自定义输入</option>
                </select>
              </label>
              {recordDraft.documentTypeMode === customOptionValue && (
                <input
                  className="record-control record-custom-input"
                  value={recordDraft.customDocumentType}
                  placeholder="请输入证件类型"
                  onChange={(event) => updateRecordDraft({ customDocumentType: event.target.value })}
                />
              )}

              <label className="record-field">
                <span>证件号</span>
                <input
                  className="record-control"
                  value={recordDraft.documentNo}
                  placeholder="请输入证件号"
                  onChange={(event) => updateRecordDraft({ documentNo: event.target.value.toUpperCase() })}
                />
              </label>

              {recordDraftError && <p className="record-error">{recordDraftError}</p>}
            </div>
            <div className="edit-actions record-edit-actions">
              <button className="edit-action edit-cancel" type="button" onClick={closeRecordEditor}>
                取消
              </button>
              <button className="edit-action edit-confirm" type="button" onClick={confirmRecordEditor}>
                确定
              </button>
            </div>
          </section>
        </div>
      )}

      {isCountEditorOpen && (
        <div className="edit-mask" role="presentation" onClick={closeCountEditor}>
          <section
            className="edit-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="count-edit-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="count-edit-title">修改记录数量</h2>
            <input
              className="edit-input"
              value={countDraftValue}
              autoFocus
              inputMode="numeric"
              pattern="[0-9]*"
              aria-invalid={countDraftError ? true : undefined}
              aria-describedby={countDraftError ? "count-edit-error" : undefined}
              onChange={(event) => {
                setCountDraftValue(event.target.value.replace(/\D/g, "").slice(0, 3));
                setCountDraftError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  confirmCountEditor();
                }

                if (event.key === "Escape") {
                  closeCountEditor();
                }
              }}
            />
            {countDraftError && (
              <p className="edit-error" id="count-edit-error">
                {countDraftError}
              </p>
            )}
            <div className="edit-actions">
              <button className="edit-action edit-cancel" type="button" onClick={closeCountEditor}>
                取消
              </button>
              <button className="edit-action edit-confirm" type="button" onClick={confirmCountEditor}>
                确定
              </button>
            </div>
          </section>
        </div>
      )}

      <Calendar
        visible={isCalendarOpen}
        type="range"
        title="选择日期"
        minDate={minQueryDate.toDate()}
        maxDate={dayjs().toDate()}
        value={[dateRange.startDate.toDate(), dateRange.endDate.toDate()]}
        allowSameDay
        confirmText="确定"
        confirmDisabledText="请选择结束日期"
        onClose={() => setIsCalendarOpen(false)}
        onConfirm={confirmCustomDateRange}
      />
      <Calendar
        visible={isRecordDateCalendarOpen}
        type="single"
        title="选择日期"
        minDate={minQueryDate.toDate()}
        maxDate={dayjs().toDate()}
        value={recordDraft ? dayjs(recordDraft.date).toDate() : undefined}
        confirmText="确定"
        onClose={() => setIsRecordDateCalendarOpen(false)}
        onConfirm={confirmRecordDate}
      />
    </main>
  );
}
