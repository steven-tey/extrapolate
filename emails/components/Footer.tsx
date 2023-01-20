import { MjmlColumn, MjmlSection, MjmlText } from "mjml-react";

export default function Footer(): JSX.Element {
  return (
    <MjmlSection cssClass="smooth">
      <MjmlColumn>
        <MjmlText cssClass="footer">
          © {new Date().getFullYear()} Extrapolate.app
        </MjmlText>
      </MjmlColumn>
    </MjmlSection>
  );
}
