# Christmas at Pecksland House

A family dinner planner for Christmas Day 2026 in Greenwich, Connecticut. The hosts can reserve tables, assign dishes, build a grocery list, and print the seating chart from one self-contained HTML file.

## Open the planner

Download the planner HTML and double-click it to open it in a browser. The project’s working filename is `Pecksland_Christmas_Planner_Seating.html`. The styles, JavaScript, illustrations, and family photos are embedded, so the planner works offline without installation or a local server.

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

Edits save in the browser on the device where you make them. The HTML contains the starting plan and photos. A JSON export carries your current seating, recipe quantities, assignments, schedule, checklists, and notes.

1. Open **Host notes** and select **Export plan**. The browser downloads a dated file named `Pecksland-Christmas-plan-YYYY-MM-DD.json`.
2. To give someone your current plan, send the HTML and the exported JSON together. If they already have the same HTML release, send just the JSON.
3. On the receiving device, open the HTML, choose **Host notes → Import plan**, select the JSON, and confirm. Importing replaces the plan currently saved in that browser. Export that copy first if you want to keep it.

Each export is a snapshot. If two hosts edit separate copies, choose which copy to carry forward before exchanging the next backup.

## Maintaining the HTML

The HTML file contains the markup, CSS, JavaScript, and image data. To update the starting content, look for these declarations in its source:

| Declaration | Contents |
| --- | --- |
| `recipes` | Menu descriptions, steps, default servings, and ingredients. The grocery list is calculated from the current recipe ingredients. |
| `defaultSchedule` | Initial activities with dates, times, descriptions, and linked jobs. |
| `guestBook` | Seating roster. Saved seating charts reference guests by their position in this list, so preserve the order when correcting a name. |
| `risks` | Backup plan titles, precautions, and responses. |
| `memories` and `ART` | Carousel photos, captions, thumbnails, and site illustrations. |

When changing defaults, check both a fresh plan and an imported backup. Saved plans carry their own recipe quantities and schedule. For changes that affect stored data, update the plan validation and migration logic so earlier backups still open.
