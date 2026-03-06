# Categorize components

All our components currently live in a flat tree which makes it a bit hard to co-locate some of our components. 
I'd like you to investigate how to properly categorize our components, and then structure the files in such a way.
Perhaps some form of the following:
```
ui/ // Buttons, Text, Heading, Pressable, CornerIndicator, PhotoPlaceholder, Fullscreen, ToggleButtons
ui/form/ // Form control elements
ui/form/pickers // Color picker, data pickers, picker, combobox
ui/navigation/ // Tabs, Breadcrumbs, Menu, Links
ui/feedback/ // progress bar, progress circle, status light, inlinealert, badge, skeleton, meter, intel branded loading
ui/overlays
ui/data/ // table, listbox, listview, illustrated message, taggroup, treeview, actionbar
ui/layouts // accordion, disclosure, view, flex, grid, well, cardview
```

After categorizing we should make sure to update our storybook stories: both the kitchensink and categorize the individual components.

I'd also like to seen an individual kitchensink per category. This one should show more differnt combinations of variants. For instance all different variants of buttons (variant, static color, style, ispending, linked button)
