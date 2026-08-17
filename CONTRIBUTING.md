# Contributing

Thanks for helping improve Developer OS.

## How to contribute

1. Fork or clone the repository.
2. Create a new branch for your feature or fix.
3. Run the project locally.
4. Make your changes and validate them.
5. Open a pull request with a clear description.

## Development workflow

### Backend

```bash
cd "D:\Django\master project\Developer-os\Backend"
..\env\Scripts\python.exe manage.py migrate
..\env\Scripts\python.exe manage.py runserver
```

### Frontend

```bash
cd "D:\Django\master project\Developer-os\Frontend"
npm install
npm run dev
```

## Code guidelines

- keep the code clean and readable
- follow the existing structure and naming conventions
- avoid unrelated changes in the same PR
- prefer small, focused commits
- validate with build checks before submitting

## Pull request checklist

- feature or fix is explained clearly
- build succeeds
- no extraneous debug logs remain
- UI/logic change is tested manually if possible

## Questions

If you are unsure about a change, open an issue first and ask before implementing large changes.
