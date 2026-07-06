frontend structure !!

src/
│
├─ app/
│  ├─ router.jsx
│  ├─ providers.jsx
│  └─ store/
│
├─ api/
│  ├─ axios.js
│  ├─ auth.api.js
│  ├─ user.api.js
│  ├─ directory.api.js
│  ├─ file.api.js
│  └─ subscription.api.js
│
├─ assets/
│
├─ components/
│  ├─ ui/
│  │  ├─ Button.jsx
│  │  ├─ Input.jsx
│  │  ├─ Modal.jsx
│  │  ├─ Dropdown.jsx
│  │  ├─ AvatarGroup.jsx
│  │  ├─ Loader.jsx
│  │  ├─ EmptyState.jsx
│  │  ├─ ConfirmDialog.jsx
│  │  └─ PageSkeleton.jsx
│  │
│  ├─ layout/
│  │  ├─ AppShell.jsx
│  │  ├─ Sidebar.jsx
│  │  ├─ Header.jsx
│  │  ├─ MobileSidebar.jsx
│  │  └─ ContentContainer.jsx
│  │
│  ├─ auth/
│  │  ├─ AuthGuard.jsx
│  │  ├─ PublicGuard.jsx
│  │  ├─ GoogleLoginButton.jsx
│  │  ├─ OtpForm.jsx
│  │  └─ LoginForm.jsx
│  │
│  ├─ files/
│  │  ├─ FileCard.jsx
│  │  ├─ FileRow.jsx
│  │  ├─ FileGrid.jsx
│  │  ├─ FileTable.jsx
│  │  ├─ FileActionMenu.jsx
│  │  ├─ UploadDropzone.jsx
│  │  ├─ UploadProgressItem.jsx
│  │  └─ ShareFileModal.jsx
│  │
│  ├─ folders/
│  │  ├─ FolderTree.jsx
│  │  ├─ FolderItem.jsx
│  │  ├─ CreateFolderModal.jsx
│  │  └─ RenameFolderModal.jsx
│  │
│  └─ dashboard/
│     ├─ QuickAccess.jsx
│     ├─ RecentFiles.jsx
│     ├─ StorageCard.jsx
│     ├─ StatsCards.jsx
│     └─ SearchBar.jsx
│
├─ context/
│  ├─ AuthContext.jsx
│  ├─ FileManagerContext.jsx
│  ├─ UploadContext.jsx
│  └─ UIContext.jsx
│
├─ features/
│  ├─ auth/
│  │  ├─ pages/
│  │  │  ├─ LoginPage.jsx
│  │  │  ├─ RegisterPage.jsx
│  │  │  └─ VerifyOtpPage.jsx
│  │  └─ hooks/
│  │     └─ useAuth.js
│  │
│  ├─ dashboard/
│  │  ├─ pages/
│  │  │  ├─ DashboardPage.jsx
│  │  │  ├─ StarredPage.jsx
│  │  │  ├─ SharedPage.jsx
│  │  │  ├─ PhotosPage.jsx
│  │  │  └─ RecentPage.jsx
│  │  └─ hooks/
│  │     └─ useDashboardData.js
│  │
│  ├─ drive/
│  │  ├─ pages/
│  │  │  ├─ AllFilesPage.jsx
│  │  │  ├─ FolderPage.jsx
│  │  │  └─ SharedFileViewPage.jsx
│  │  └─ hooks/
│  │     ├─ useDirectory.js
│  │     ├─ useFiles.js
│  │     └─ useShare.js
│  │
│  ├─ settings/
│  │  └─ pages/
│  │     └─ SessionsPage.jsx
│  │
│  └─ billing/
│     └─ pages/
│        └─ BillingPage.jsx
│
├─ hooks/
│  ├─ useDebounce.js
│  ├─ useDisclosure.js
│  ├─ useMediaQuery.js
│  └─ useClickOutside.js
│
├─ lib/
│  ├─ cn.js
│  ├─ formatBytes.js
│  ├─ formatDate.js
│  ├─ fileIcon.js
│  ├─ storage.js
│  └─ constants.js
│
├─ pages/
│  ├─ NotFound.jsx
│  └─ Unauthorized.jsx
│
├─ styles/
│  └─ globals.css
│
├─ App.jsx
└─ main.jsx


 Core design decision: use 4 contexts only

I don’t want to make the app laggy with random prop drilling or a giant global context.

Contexts
1. AuthContext

Handles:

current user
login/register/logout/google auth
session fetch on app load
2. FileManagerContext

Handles:

current directory
directory items
breadcrumbs
list/grid mode
selected file/folder
create/rename/delete folder/file
refresh current folder
3. UploadContext

Handles:

upload queue
upload progress
upload initiate/complete
upload UI state
4. UIContext

Handles:

sidebar open/close
modals
theme state if needed
generic app UI toggles

That’s it. 



ui styling is this :

Left sidebar
User card
Navigation items:
All Files
Photos
Shared Files
Starred
Signatures / Theme / maybe settings
Project/folder tree
Storage card at bottom
Top header
Workspace title / current folder
Search input
Share button
Upload button
View switch buttons (grid/list)
profile / notifications / actions
Main content
Quick access cards
Recent files table
Right-side preview/details panel on desktop
Mobile collapses cleanly

I’ll use that visual structure but adapt it to your actual API + features.