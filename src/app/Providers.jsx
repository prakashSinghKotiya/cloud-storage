import { AuthProvider } from "../context/AuthContext";

import { UploadProvider } from "../context/UploadContext";
import { UIProvider } from "../context/UIContext";
import { DriveProvider } from "../context/DriveContext";
import { ContextMenuProvider } from "../context/ContextMenuContext";
import { OperationProvider } from "../context/OperationContext";
import OperationManager from "../components/userextra/Popups";

export default function AppProviders({ children }) {
  return (
    <OperationProvider>
    <AuthProvider>
      <UIProvider>
        <DriveProvider> 
          
          <UploadProvider>
            <ContextMenuProvider>
              {children}
              </ContextMenuProvider>
              <OperationManager />
            </UploadProvider>
            
        </DriveProvider>
      </UIProvider>
    </AuthProvider>
    </OperationProvider>
  );
}