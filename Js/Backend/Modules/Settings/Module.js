import Webiny from 'Webiny';
import Views from './Views/Views';

class Settings extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('DevTools', [
                new Menu('Backups', [
                    new Menu('Settings', 'BackupApp.Settings')
                ]).setRole('manage-backups')
            ], 'icon-bell')
        );

        this.registerRoutes(
            new Webiny.Route('BackupApp.Settings', '/backup-app/settings', Views.SettingsForm, 'Backup App - Settings')
        );
    }
}

export default Settings;