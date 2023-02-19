import { Button, Menu, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ExportDataDialog from './ExportDataDialog';
import ImportDataDialog from './ImportDataDialog';

const FileMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const menuOpen = Boolean(anchorEl);
  const [action, setAction] = useState<'export_data' | 'import_data' | ''>('');

  useEffect(() => {
    if (action.length > 0) {
      setAnchorEl(undefined);
    }
  }, [action]);

  const closeDialog = () => setAction('');

  return (
    <div>
      <Button
        onClick={(ev) => {
          setAnchorEl(ev.currentTarget);
        }}
      >
        File
      </Button>
      <Menu
        onClose={() => setAnchorEl(undefined)}
        marginThreshold={0}
        anchorEl={anchorEl}
        open={menuOpen}
        MenuListProps={{
          dense: true,
        }}
      >
        <MenuItem>
          Save as template
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAction('import_data');
          }}
        >
          Import data
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAction('export_data');
          }}
        >
          Export data
        </MenuItem>
      </Menu>
      <ExportDataDialog
        open={action === 'export_data'}
        onClose={closeDialog}
      />
      <ImportDataDialog
        open={action === 'import_data'}
        onClose={closeDialog}
      />
    </div>
  );
};

export default FileMenu;
