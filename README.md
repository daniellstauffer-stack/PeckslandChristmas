# Christmas at Pecksland House

A family dinner planner for Christmas Day 2026 in Greenwich, Connecticut. The hosts can reserve tables, assign dishes, build a grocery list, and print the seating chart from one self-contained HTML file.

## Open the planner

Open the site, enter your invited email address, and click the sign-in link sent to your inbox. Sign-in and opening the planner require an internet connection. Use **Sign out** when you finish on a shared device.

The planner opens on **Seating chart**, with two round tables of eight. To start with advance prep, open **Schedule** and select **Fri, Dec 11**. That day includes the headcount, table and chair rentals, and pre-orders for the prime rib and bûches de Noël.

## Using the planner

| Tab | What you can do |
| --- | --- |
| Menu | Open a dish to edit ingredients, scale its servings, or assign a cook. Save the recipe to update the grocery list. The default entrée split is ten portions of prime rib and six of Chicken Marsala. |
| Seating chart | Select two guests in succession to swap seats, or drag one onto the other. Use **Undo swap** to reverse the last swap. Print the chart once both tables are set. |
| Grocery list | See combined ingredient quantities by aisle. Check off purchases, choose **Still needed** to see what is left, or print the list. |
| Schedule | Add, edit, assign, or remove activities. Choose a date to see its timeline, check off completed tasks, or print the full schedule. The initial plan spans December 11, 18, 24, and 25. |
| People & roles | Add helpers and assign dishes or household jobs. Assignments appear beside the relevant recipes and schedule activities. |
| Backup plans | Find a precaution and a fallback for eight holiday mishaps, from a late roast to a flan that won’t leave its pan. |
| Host notes | Record dietary needs, pickup details, and reminders. Notes save as you type. This tab also holds the plan backup controls. |
| Memories | Browse six family photos using the arrows, thumbnails, or touch swipes. When a carousel control has focus, the left and right arrow keys also change photos. |

## Save, share, or restore a plan

Edits save in the current browser under your signed-in account. Supabase supplies the starting planner and photos to approved accounts. A JSON export carries your current seating, recipe quantities, assignments, schedule, checklists, and notes.

1. Open **Host notes** and select **Export plan**. The browser downloads a dated file named `Pecksland-Christmas-plan-YYYY-MM-DD.json`.
2. To share your current plan, send the exported JSON privately to an invited family member.
3. On the receiving device, sign in, choose **Host notes → Import plan**, select the JSON, and confirm. Importing replaces the plan currently saved for that account in that browser. Export that copy first if you want to keep it.

Each export is a snapshot. Changes made on one device do not sync to others. If you have edits saved in the older planner, export them from that version and import them after signing in.

## Host setup

1. Create a Supabase project and run [supabase/setup.sql](supabase/setup.sql) in the SQL Editor. It creates a private bucket and permits downloads of the planner only for approved accounts.
2. Upload the private `planner.html` to the root of the `pecksland-private` bucket. The original planner was moved out of the repository to `/workspace/PeckslandChristmas-private/planner.html` during setup. Keep a private copy for maintenance. If the old planner was already published, its photos and roster may still be accessible in Git history or earlier deployments. The new login applies to the new site.
3. Put your project URL and **publishable key** in [supabase-config.js](supabase-config.js). Both are intended for browser use. Keep the service-role key and database credentials in Supabase or your private settings.
4. Under **Authentication → URL Configuration**, set **Site URL** to the production planner URL, including the repository path on GitHub Pages. Add the exact URLs visitors will use to **Redirect URLs**. Add the local URL for development if needed. Keep the default **Magic Link** email template with `{{ .ConfirmationURL }}`. Configure [custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp) for family addresses. Supabase’s default sender is restricted to project team addresses.
5. Keep email sign-in enabled and turn off public sign-ups in Supabase Auth. Under **Authentication → Users**, invite each family member, including yourself. After the invited account appears in the Users list, copy its user UUID and add it in the SQL Editor:

   ```sql
   insert into public.pecksland_members (user_id)
   values ('REPLACE_WITH_INVITED_USER_UUID')
   on conflict do nothing;
   ```

   To revoke planner access, delete that UUID from `public.pecksland_members`.
6. Deploy the public site from a revision that contains `index.html`, `auth.js`, and `supabase-config.js`. Keep the private `planner.html` in Supabase Storage. In a private browser window, verify that an approved account can open the planner, that sign-out returns to the login screen, and that an account outside the allowlist cannot download the planner.

## Maintaining the HTML

The private `planner.html` contains the markup, CSS, JavaScript, and image data. To update the starting content, edit the private copy and replace the object in Supabase Storage. Look for these declarations in its source:

| Declaration | Contents |
| --- | --- |
| `recipes` | Menu descriptions, steps, default servings, and ingredients. The grocery list is calculated from the current recipe ingredients. |
| `defaultSchedule` | Initial activities with dates, times, descriptions, and linked jobs. |
| `guestBook` | Seating roster. Saved seating charts reference guests by their position in this list, so preserve the order when correcting a name. |
| `risks` | Backup plan titles, precautions, and responses. |
| `memories` and `ART` | Carousel photos, captions, thumbnails, and site illustrations. |

When changing defaults, check both a fresh plan and an imported backup. Saved plans carry their own recipe quantities and schedule. For changes that affect stored data, update the plan validation and migration logic so earlier backups still open.
