import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles for DateTimeCellRenderer
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    default: css`
      padding: ${theme.spacing(0)};
      margin: ${theme.spacing(0)};
      border: none;
      font-family: inherit;
      font-size: inherit;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `,
    preformatted: css`
      width: 100%;
      border: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      
      /* Ensure good contrast for various date formats */
      span {
        font-family: ${theme.typography.fontFamilyMonospace};
        font-size: ${theme.typography.size.sm};
      }
    `,
    // Optional: Add a style for relative time display to make it more distinctive
    relativeTime: css`
      font-style: italic;
      color: ${theme.colors.text.secondary};
    `,
    // Optional: Add style for invalid dates
    invalidDate: css`
      color: ${theme.colors.error.main};
      font-style: italic;
    `
  };
};