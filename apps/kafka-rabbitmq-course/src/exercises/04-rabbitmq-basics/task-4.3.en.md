# Task 4.3: Virtual Hosts and Permissions

## Goal

Create an interactive Virtual Host and permissions editor for RabbitMQ. The student will understand the vhost isolation model, the three-level permission system (configure/write/read) based on regex patterns, and how these permissions apply to real resources.

## Requirements

1. Define interfaces `VHost`, `RmqUser`, and `Permission`:
   - `VHost`: `name`, `description`, `tags: string[]`, `created`
   - `RmqUser`: `username`, `tags: string[]`, `color`
   - `Permission`: `user`, `vhost`, `configure`, `write`, `read`
2. Create initial data: at least 3 vhosts (including `/`), 3 users with different tags (`administrator`, `none`, `monitoring`), and 4 permission records with different access levels.
3. Implement the left panel with two sections:
   - **Virtual Hosts**: list with the active vhost highlighted. Click — selects the vhost. Delete button for all vhosts except `/`. Form for adding a new vhost (input + "+" button, works on Enter and click).
   - **Users**: list with colored dots and tags. Click — selects/deselects the user.
4. Implement the main area with two tabs (`matrix`, `editor`):
   - **"matrix" tab**: permissions table for the selected vhost. Rows — users, cells — permissions (configure/write/read as `code`). Edit button in each row navigates to the "editor" tab. Color highlighting: full access `.*` — green, empty pattern — red.
   - **"editor" tab**: permission editing form for a specific user in a specific vhost. Three input fields (configure, write, read) with hints. Live preview: list from `RESOURCE_NAMES` with green/red regex match indicators. "Save" and "Cancel" buttons.
5. Implement function `matchesRegex(pattern: string, name: string): boolean` — checks if a resource name matches the pattern (`^pattern$`), handles empty string as false, and catches invalid regex exceptions.
6. When deleting a vhost — automatically delete all associated permissions.
7. When saving permissions — update an existing record or add a new one.

## Checklist

- [ ] Interfaces `VHost`, `RmqUser`, `Permission` are strictly typed
- [ ] Initial data: 3 vhosts, 3 users, 4 permissions with different patterns
- [ ] Vhosts list: highlight, delete (except `/`), add via form
- [ ] Add vhost form works on Enter and "+" click
- [ ] Users list: colored dots, tags, click selection
- [ ] Permissions matrix for the selected vhost displays all 3 fields
- [ ] Pattern `.*` is highlighted green, empty — red
- [ ] Edit button opens the editor tab with filled fields
- [ ] Live preview in editor shows which resources the pattern matches
- [ ] `matchesRegex` correctly handles empty strings and invalid regex
- [ ] Save updates existing or adds a new record
- [ ] Deleting a vhost removes associated permissions

## How to Check Yourself

1. Select vhost `/production` — the matrix shows permissions for `admin`, `app_user`, `monitor`.
2. `app_user` has configure empty and write/read with `orders\..*|payments\..*` — limited access.
3. Click the edit button for `app_user` — the editor opens.
4. In the write field, enter `audit\..*` — a green indicator appears next to `audit.events` in the preview.
5. Clear the write field — all indicators turn red.
6. Save — return to matrix, updated permissions are visible.
7. Add a new vhost `/dev` via the form — it appears in the list.
8. Click "✕" next to `/dev` — the vhost is deleted, its permissions disappear from the matrix.
9. Try to delete `/` — nothing happens (the default vhost is protected).