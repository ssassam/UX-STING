"use client";
import { Button } from "@unified-ui/react/button";
import { Field, Fieldset } from "@unified-ui/react/field";
import { Form } from "@unified-ui/react/form";
import { Input } from "@unified-ui/react/input";
import { List, ListItem } from "@unified-ui/react/list";
import { NativeSelect } from "@unified-ui/react/native-select";
import { Switch } from "@unified-ui/react/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@unified-ui/react/tabs";
import { TimePicker } from "@unified-ui/react/time-picker";
import { toast } from "@unified-ui/react/toast";
import { Heading } from "@unified-ui/react/typography";

export default function SettingsPage() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <Heading level={1} size="lg">
        Settings
      </Heading>
      <Tabs defaultValue="profile">
        <TabsList aria-label="Settings sections">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Form className="max-w-xl" onSubmit={() => void toast.success("Profile saved")}>
            <Fieldset legend="Public profile">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="first" label="First name" required>
                  <Input autoComplete="given-name" defaultValue="Salma" />
                </Field>
                <Field name="last" label="Last name" required>
                  <Input autoComplete="family-name" defaultValue="Idrissi" />
                </Field>
              </div>
              <Field name="email" label="Email" required>
                <Input type="email" autoComplete="email" defaultValue="salma@example.com" />
              </Field>
              <Field name="language" label="Language">
                <NativeSelect defaultValue="en">
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="ar">العربية</option>
                </NativeSelect>
              </Field>
            </Fieldset>
            <Button type="submit" className="justify-self-start">
              Save profile
            </Button>
          </Form>
        </TabsContent>
        <TabsContent value="notifications">
          <List variant="bordered" className="max-w-xl">
            <ListItem
              title="New bookings"
              description="Email and push"
              end={<Switch aria-label="New bookings" defaultChecked />}
            />
            <ListItem
              title="Reviews"
              description="When a guest leaves a review"
              end={<Switch aria-label="Reviews" defaultChecked />}
            />
            <ListItem
              title="Marketing"
              description="Tips and product news"
              end={<Switch aria-label="Marketing" />}
            />
          </List>
        </TabsContent>
        <TabsContent value="availability">
          <div className="grid max-w-md gap-4 sm:grid-cols-2">
            <Field label="Check-in from">
              <TimePicker defaultValue="14:00" />
            </Field>
            <Field label="Check-out until">
              <TimePicker defaultValue="11:00" />
            </Field>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
