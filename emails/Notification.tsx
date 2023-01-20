import {
  Mjml,
  MjmlBody,
  MjmlColumn,
  MjmlSection,
  MjmlText,
  MjmlWrapper,
} from "mjml-react";
import ButtonPrimary from "./components/ButtonPrimary";
import Divider from "./components/Divider";
import Footer from "./components/Footer";
import Head from "./components/Head";
import Header from "./components/Header";
import { purple } from "./components/theme";

export default function Notification({ url }: { url: string }): JSX.Element {
  return (
    <Mjml>
      <Head />
      <MjmlBody width={500}>
        <MjmlWrapper cssClass="container">
          <Header title="Your Extrapolate Results" />
          <MjmlSection cssClass="smooth">
            <MjmlColumn>
              <MjmlText cssClass="paragraph">
                Your Extrapolate results are ready!
              </MjmlText>
              <MjmlText cssClass="paragraph">
                Please click the link below to access your results:
              </MjmlText>
              <ButtonPrimary link={url} uiText="View my results" />
              <MjmlText cssClass="paragraph">
                As a reminder, your results will be deleted after 24 hours.
              </MjmlText>
              <Divider />
            </MjmlColumn>
          </MjmlSection>
          <Footer />
        </MjmlWrapper>
      </MjmlBody>
    </Mjml>
  );
}
