import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  CellCoordinate,
  SheetCells,
  CellStyle
} from '../types/excel';
import {
  colIndexToLabel,
  coordinateToCellId,
  coordinateToKey,
  evaluateCell,
  formatCellValue
} from '../utils/formulaEngine';

interface GridProps {
  cells: SheetCells;
  rowCount: number;
  colCount: number;
  activeCell: CellCoordinate;
  onSelectCell: (coord: CellCoordinate) => void;
  onCellChange: (key: string, value: string) => void;
  cellDraft: string;
  setCellDraft: (val: string) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  colWidths?: Record<number, number>;
  onColResize?: (col: number, width: number) => void;
  isRtl?: boolean;
}

export const Grid: React.FC<GridProps> = ({
  cells,
  rowCount,
  colCount,
  activeCell,
  onSelectCell,
  onCellChange,
  cellDraft,
  setCellDraft,
  isEditing,
  setIsEditing,
  colWidths = {},
  onColResize,
  isRtl = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cellInputRef = useRef<HTMLInputElement>(null);
  const hiddenFocusRef = useRef<HTMLInputElement>(null);

  // Dragging / Selection for formulas
  const [isFormulaSelectionMode, setIsFormulaSelectionMode] = useState(false);
  const [formulaRangeStart, setFormulaRangeStart] = useState<CellCoordinate | null>(null);
  const [formulaRangeEnd, setFormulaRangeEnd] = useState<CellCoordinate | null>(null);

  // Column resizing state
  const [resizingCol, setResizingCol] = useState<{ col: number; startX: number; startWidth: number } | null>(null);

  // Check if draft formula is active
  const isFormula = cellDraft.startsWith('=');

  // Focus management: when not editing, focus hidden input so keyboard typing is immediately captured
  useEffect(() => {
    if (isEditing) {
      if (cellInputRef.current) {
        cellInputRef.current.focus();
      }
    } else {
      if (hiddenFocusRef.current && document.activeElement !== hiddenFocusRef.current) {
        hiddenFocusRef.current.focus();
      }
    }
  }, [isEditing, activeCell]);

  // Keep cell input focused and cursor at the end when editing starts
  useEffect(() => {
    if (isEditing && cellInputRef.current) {
      const el = cellInputRef.current;
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
    }
  }, [isEditing]);

  const activeKey = coordinateToKey(activeCell);
  const activeCellData = cells[activeKey];

  // Helper to commit current edit and move
  const commitAndNavigate = useCallback((dCol: number, dRow: number) => {
    const key = coordinateToKey(activeCell);
    onCellChange(key, cellDraft);
    setIsEditing(false);
    setIsFormulaSelectionMode(false);
    setFormulaRangeStart(null);
    setFormulaRangeEnd(null);

    const nextCol = Math.max(0, Math.min(colCount - 1, activeCell.col + dCol));
    const nextRow = Math.max(0, Math.min(rowCount - 1, activeCell.row + dRow));
    const nextCoord = { col: nextCol, row: nextRow };
    onSelectCell(nextCoord);

    // Prepare draft for the new cell
    const nextKey = coordinateToKey(nextCoord);
    const nextCell = cells[nextKey];
    setCellDraft(nextCell?.value ?? '');

    // Focus hidden input immediately so user can type on the next cell without mouse!
    setTimeout(() => {
      if (hiddenFocusRef.current) {
        hiddenFocusRef.current.focus();
      }
    }, 0);
  }, [activeCell, cellDraft, cells, colCount, onCellChange, onSelectCell, rowCount, setCellDraft, setIsEditing]);

  // Handle keys when cell is NOT in editing mode (navigation and immediate typing)
  const handleContainerKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) return;

    // Enter -> Move Down and immediately ready to type
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        commitAndNavigate(0, -1);
      } else {
        commitAndNavigate(0, 1);
      }
      return;
    }

    // Tab -> Move Right / Left
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        commitAndNavigate(-1, 0);
      } else {
        commitAndNavigate(1, 0);
      }
      return;
    }

    // Navigation arrows
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      commitAndNavigate(0, 1);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      commitAndNavigate(0, -1);
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      commitAndNavigate(isRtl ? -1 : 1, 0);
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      commitAndNavigate(isRtl ? 1 : -1, 0);
      return;
    }

    // Delete or Backspace clears cell
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      onCellChange(activeKey, '');
      setCellDraft('');
      return;
    }

    // F2 enters edit mode preserving existing text
    if (e.key === 'F2') {
      e.preventDefault();
      setIsEditing(true);
      return;
    }

    // Alphanumeric, digits, Arabic characters, punctuation, '=' starts typing immediately!
    if (
      e.key.length === 1 &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      // Immediate typing without needing mouse!
      e.preventDefault();
      setCellDraft(e.key);
      setIsEditing(true);
      if (e.key === '=') {
        setIsFormulaSelectionMode(true);
      }
    }
  };

  // Handle cell click
  const handleCellClick = (col: number, row: number, e: React.MouseEvent) => {
    e.stopPropagation();

    // If we are currently entering a formula (draft starts with '=' or contains unclosed function)
    if (isEditing && cellDraft.startsWith('=')) {
      // Single click selects the cell reference for the formula!
      const targetId = coordinateToCellId({ col, row });
      
      // If formula ends with '(' or operator (+ - * / ,) or just '=':
      const trimmed = cellDraft.trim();
      const lastChar = trimmed.slice(-1);
      let updatedDraft = cellDraft;

      if (lastChar === '(' || lastChar === ',' || lastChar === '+' || lastChar === '-' || lastChar === '*' || lastChar === '/' || lastChar === '=') {
        updatedDraft = cellDraft + targetId;
      } else if (trimmed.endsWith(')')) {
        // Replace inside parentheses or append
        updatedDraft = cellDraft.slice(0, -1) + targetId + ')';
      } else {
        // If it's replacing last reference
        const match = cellDraft.match(/([A-Z]+\d+)$/i);
        if (match) {
          updatedDraft = cellDraft.substring(0, match.index) + targetId;
        } else {
          updatedDraft = cellDraft + targetId;
        }
      }

      setCellDraft(updatedDraft);
      setFormulaRangeStart({ col, row });
      setFormulaRangeEnd({ col, row });
      setIsFormulaSelectionMode(true);
      return;
    }

    // Normal click: commit current cell and select clicked cell
    if (activeCell.col !== col || activeCell.row !== row) {
      if (isEditing) {
        onCellChange(coordinateToKey(activeCell), cellDraft);
        setIsEditing(false);
      }
      onSelectCell({ col, row });
      const nextKey = coordinateToKey({ col, row });
      setCellDraft(cells[nextKey]?.value ?? '');
      setIsFormulaSelectionMode(false);
      setFormulaRangeStart(null);
      setFormulaRangeEnd(null);
    }
  };

  // Double click to enter edit mode with full existing text
  const handleCellDoubleClick = (col: number, row: number) => {
    onSelectCell({ col, row });
    const key = coordinateToKey({ col, row });
    setCellDraft(cells[key]?.value ?? '');
    setIsEditing(true);
  };

  // Handle input changes while editing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCellDraft(val);
    if (val.startsWith('=')) {
      setIsFormulaSelectionMode(true);
    } else {
      setIsFormulaSelectionMode(false);
      setFormulaRangeStart(null);
      setFormulaRangeEnd(null);
    }
  };

  // Input key down (in editing mode)
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        commitAndNavigate(0, -1);
      } else {
        commitAndNavigate(0, 1);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        commitAndNavigate(-1, 0);
      } else {
        commitAndNavigate(1, 0);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      // Cancel edit and restore original value
      setCellDraft(activeCellData?.value ?? '');
      setIsEditing(false);
      setIsFormulaSelectionMode(false);
      setFormulaRangeStart(null);
      setFormulaRangeEnd(null);
    }
  };

  // Column resize mouse events
  const handleResizeStart = (col: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const currentW = colWidths[col] || 90;
    setResizingCol({ col, startX: e.clientX, startWidth: currentW });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingCol) return;
      const delta = isRtl ? resizingCol.startX - e.clientX : e.clientX - resizingCol.startX;
      const newWidth = Math.max(40, resizingCol.startWidth + delta);
      if (onColResize) {
        onColResize(resizingCol.col, newWidth);
      }
    };

    const handleMouseUp = () => {
      setResizingCol(null);
    };

    if (resizingCol) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingCol, isRtl, onColResize]);

  // Extract referenced cells from formula for highlighting (e.g. A1, B2:B6)
  const getReferencedRanges = useCallback((): CellCoordinate[] => {
    if (!cellDraft.startsWith('=')) return [];
    const refs: CellCoordinate[] = [];
    const rangeRegex = /([A-Z]+)(\d+)(?::([A-Z]+)(\d+))?/gi;
    let match;
    while ((match = rangeRegex.exec(cellDraft)) !== null) {
      const startCol = match[1].toUpperCase().charCodeAt(0) - 65;
      const startRow = parseInt(match[2], 10) - 1;
      if (match[3] && match[4]) {
        const endCol = match[3].toUpperCase().charCodeAt(0) - 65;
        const endRow = parseInt(match[4], 10) - 1;
        const minC = Math.min(startCol, endCol);
        const maxC = Math.max(startCol, endCol);
        const minR = Math.min(startRow, endRow);
        const maxR = Math.max(startRow, endRow);
        for (let r = minR; r <= maxR; r++) {
          for (let c = minC; c <= maxC; c++) {
            refs.push({ col: c, row: r });
          }
        }
      } else {
        refs.push({ col: startCol, row: startRow });
      }
    }
    return refs;
  }, [cellDraft]);

  const referencedCoords = getReferencedRanges();

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleContainerKeyDown}
      className="relative flex-1 overflow-auto bg-slate-100 select-none outline-none font-sans"
      style={{ direction: isRtl ? 'rtl' : 'ltr' }}
    >
      {/* Hidden input to catch keystrokes and enable instant typing without mouse */}
      <input
        ref={hiddenFocusRef}
        type="text"
        aria-hidden="true"
        className="opacity-0 absolute top-0 left-0 w-0 h-0 pointer-events-none p-0 m-0 border-0"
        tabIndex={-1}
      />

      <div className="inline-block min-w-full">
        {/* Table representation */}
        <table className="border-collapse border-spacing-0 bg-white table-fixed">
          {/* Column Headers */}
          <thead>
            <tr className="bg-slate-200/90 sticky top-0 z-20 shadow-xs">
              {/* Corner Select-All cell */}
              <th className="w-12 h-6 border border-slate-300 bg-slate-300/80 sticky left-0 z-30 text-slate-500 font-normal text-[11px] select-none p-0 text-center">
                ◢
              </th>

              {Array.from({ length: colCount }).map((_, c) => {
                const label = colIndexToLabel(c);
                const isColActive = activeCell.col === c;
                const width = colWidths[c] || 90;
                return (
                  <th
                    key={c}
                    style={{ width, minWidth: width, maxWidth: width }}
                    className={`h-6 border border-slate-300 text-[11px] font-semibold text-center select-none relative group transition-colors ${
                      isColActive ? 'bg-emerald-200/90 text-emerald-900 font-bold border-b-2 border-b-emerald-600' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {label}

                    {/* Resizer Handle */}
                    <div
                      onMouseDown={(e) => handleResizeStart(c, e)}
                      className={`absolute top-0 bottom-0 ${isRtl ? 'left-0' : 'right-0'} w-1.5 cursor-col-resize hover:bg-emerald-500 z-10`}
                    />
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Rows & Cells */}
          <tbody>
            {Array.from({ length: rowCount }).map((_, r) => {
              const isRowActive = activeCell.row === r;
              return (
                <tr key={r} className="h-6">
                  {/* Row Number Header */}
                  <th
                    className={`w-12 h-6 border border-slate-300 text-[11px] font-semibold text-center select-none sticky left-0 z-10 transition-colors ${
                      isRowActive ? 'bg-emerald-200 text-emerald-900 font-bold border-r-2 border-r-emerald-600' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {r + 1}
                  </th>

                  {/* Columns */}
                  {Array.from({ length: colCount }).map((_, c) => {
                    const coord: CellCoordinate = { col: c, row: r };
                    const key = coordinateToKey(coord);
                    const cell = cells[key];
                    const isSelected = activeCell.col === c && activeCell.row === r;
                    const isReferenced = referencedCoords.some((rc) => rc.col === c && rc.row === r);
                    const width = colWidths[c] || 90;

                    // Computed value
                    const computed = evaluateCell(key, cells);
                    const formatted = formatCellValue(computed, cell?.style?.format);

                    // Style
                    const style: React.CSSProperties = {
                      width,
                      minWidth: width,
                      maxWidth: width,
                      fontWeight: cell?.style?.bold ? 'bold' : 'normal',
                      fontStyle: cell?.style?.italic ? 'italic' : 'normal',
                      textDecoration: cell?.style?.underline ? 'underline' : 'none',
                      color: cell?.style?.color || '#0f172a',
                      backgroundColor: cell?.style?.backgroundColor || (isReferenced ? '#dbeafe' : '#ffffff'),
                      textAlign: cell?.style?.align || (typeof computed === 'number' ? 'right' : 'left'),
                    };

                    return (
                      <td
                        key={c}
                        onClick={(e) => handleCellClick(c, r, e)}
                        onDoubleClick={() => handleCellDoubleClick(c, r)}
                        style={style}
                        className={`h-6 border border-slate-200 px-1 text-xs whitespace-nowrap overflow-hidden text-ellipsis cursor-cell relative select-none ${
                          isSelected
                            ? 'ring-2 ring-emerald-600 ring-offset-0 z-10 bg-white'
                            : isReferenced
                            ? 'ring-2 ring-blue-500 ring-dashed z-5'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        {isSelected && isEditing ? (
                          <input
                            ref={cellInputRef}
                            type="text"
                            value={cellDraft}
                            onChange={handleInputChange}
                            onKeyDown={handleInputKeyDown}
                            className="w-full h-full bg-white text-xs outline-none p-0 border-0 font-sans"
                            style={{
                              textAlign: style.textAlign,
                              fontWeight: style.fontWeight,
                              color: style.color
                            }}
                          />
                        ) : (
                          <span>{formatted}</span>
                        )}

                        {/* Excel handle square at bottom-right of selected cell */}
                        {isSelected && !isEditing && (
                          <div className={`absolute bottom-0 ${isRtl ? 'left-0' : 'right-0'} w-1.5 h-1.5 bg-emerald-700 cursor-crosshair`} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
