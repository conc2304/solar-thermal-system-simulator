import type { ThemeUIStyleObject } from 'theme-ui';


export const TextVariants: Record<string, ThemeUIStyleObject> = {
  h1: {
    fontFamily: 'heading',
    fontWeight: 'heading',
    fontSize: 6,
    lineHeight: 'heading',
  },
  h2: {
    fontFamily: 'heading',
    fontWeight: 'heading',
    fontSize: 5,
    lineHeight: 'heading',
  },
  h3: {
    fontFamily: 'heading',
    fontWeight: 'heading',
    fontSize: 4,
    lineHeight: 'heading',
  },
  h4: {
    fontFamily: 'body',
    fontWeight: 'bold',
    fontSize: 3,
    lineHeight: 'body',
  },
  h5: {
    fontFamily: 'body',
    fontWeight: 'body',
    fontSize: 2,
    lineHeight: 'body',
  },
  h6: {
    fontFamily: 'body',
    fontWeight: 'bold',
    fontSize: 1,
    lineHeight: 'body',
  },
  body: {
    fontFamily: 'body',
    fontWeight: 'body',
    fontSize: 2,
    lineHeight: 'body',
    letterSpacing: '0.00938em',
  },
  caption: {
    fontFamily: 'body',
    fontWeight: 'bold',
    fontSize: 0,
    lineHeight: 'body',
    letterSpacing: '0.03333em',
  },
  overline: {
    fontFamily: 'body',
    fontWeight: 'body',
    fontSize: 0,
    lineHeight: 'body',
    letterSpacing: '0.08333em',
    textTransform: 'uppercase',
  },
  button: {
    fontFamily: 'body',
    fontWeight: 'body',
    fontSize: 1,
    lineHeight: 'body',
    letterSpacing: '0.02857em',
    textTransform: 'uppercase',
  },
  monospace: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 1,
    lineHeight: 'body',
    letterSpacing: '0.02857em',
  }
};