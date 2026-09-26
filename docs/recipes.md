# Recipes

## Confirm then undo

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild><Button variant="destructive">Delete</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
      <AlertDialogDescription>You can undo for 10 seconds.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="destructive" onClick={() => {
        remove(id);
        toast("Listing deleted", { duration: 10000, action: { label: "Undo", onClick: () => restore(id) } });
      }}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Responsive filters

```tsx
<div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
  <FilterPanel activeCount={count} onClear={clear}>
    <FilterSection title="Price"><RangeSlider … /></FilterSection>
  </FilterPanel>
  <div>
    <FilterChips filters={chips} onRemove={removeFilter} onClearAll={clear} />
    <Grid columns={{ base: 1, sm: 2, xl: 3 }}>{results}</Grid>
  </div>
</div>
```

## Command palette for navigation

```tsx
<CommandDialog>
  <CommandInput placeholder="Jump to…" />
  <CommandList>
    <CommandEmpty />
    <CommandGroup heading="Pages">
      {pages.map((p) => <CommandItem key={p.href} value={p.title} onSelect={() => router.push(p.href)} />)}
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

## Server-side table

```tsx
<DataTable manual data={rows} totalRows={total} page={page} onPageChange={setPage}
  sort={sort} onSortChange={setSort} loading={isFetching} … />
```

## Link components with Next.js

```tsx
<Pagination totalPages={20} page={page} getHref={(p) => `?page=${p}`}
  renderLink={({ href, ...props }) => <NextLink href={href} {...props} />} />
```
