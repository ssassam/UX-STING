import { Avatar } from "@unified-ui/react/avatar";
import { Badge } from "@unified-ui/react/badge";
import { List, ListItem } from "@unified-ui/react/list";
import { Heading } from "@unified-ui/react/typography";

export const metadata = { title: "Inbox" };

const messages = [
  ["Aya Tazi", "Is early check-in possible on the 18th?", true],
  ["Tom Becker", "Thanks for the great stay!", false],
  ["Lucas Martin", "Could you send an invoice for my company?", true],
  ["Emma Rossi", "Do you have parking nearby?", false],
] as const;

export default function InboxPage() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <Heading level={1} size="lg">
        Inbox
      </Heading>
      <List variant="bordered">
        {messages.map(([name, text, unread]) => (
          <ListItem
            key={name}
            start={<Avatar size="sm" name={name} />}
            title={name}
            description={text}
            end={
              unread ? (
                <Badge variant="primary" dot>
                  New
                </Badge>
              ) : null
            }
          />
        ))}
      </List>
    </div>
  );
}
