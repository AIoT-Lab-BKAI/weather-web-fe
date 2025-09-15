import { createLink, LinkComponent } from "@tanstack/react-router";
import { Button } from "./button";

function BasicLinkComponent({ ...props }) {
  return (
    <Button {...props} variant="link" />
  );
}

const CreatedLinkComponent = createLink(BasicLinkComponent);

export const Link: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload="intent" {...props} />;
};
