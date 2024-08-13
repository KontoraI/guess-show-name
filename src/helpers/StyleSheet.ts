import { css, CSSObject, SerializedStyles } from "@emotion/react";
type CSSProperties = {
  [key: string]: CSSObject;
};

export default class StyleSheet {
  static create<Styles extends CSSProperties>(
    styles: Styles
  ): { [K in keyof Styles]: SerializedStyles } {
    const emotionStyles: { [key in keyof Styles]: SerializedStyles } =
      {} as any;
    for (const key in styles) {
      if (styles.hasOwnProperty(key)) {
        emotionStyles[key] = css(styles[key]);
      }
    }
    return emotionStyles;
  }
}
