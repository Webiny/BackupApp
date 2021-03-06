import React from 'react';
import Webiny from 'webiny';
import BackupDetailsModal from './BackupDetailsModal';

/**
 * @i18n.namespace BackupApp.Backend.Backups.BackupBox
 */
class BackupBox extends Webiny.Ui.View {

    constructor(props) {
        super(props);

        this.state = {
            status: 'info',
            statusMsg: this.i18n('Reading backup status'),
            backupDetails: null
        };

        this.readBackupStatus();
    }

    readBackupStatus() {
        const api = new Webiny.Api.Endpoint('/entities/backup-app/backups');

        // show modal box
        api.get('?name=' + this.props.backup).then((response) => {
            if (response.getData('list').length < 1) {
                this.setState({
                    status: 'danger',
                    statusMsg: Webiny.I18n(`Backup doesn't exist`)
                });

                return;
            }

            const backup = response.getData('list')[0];

            // check when the backup was created
            const date1 = new Date();
            const date2 = new Date(backup.dateCreated);
            const dateDiff = Math.abs(date1 - date2) / 36e5;

            let isBackupFresh = false;
            switch (this.props.backup) {
                case '24h':
                    if (dateDiff < 24) {
                        isBackupFresh = true;
                    }
                    break;

                case '48h':
                    if (dateDiff < 48) {
                        isBackupFresh = true;
                    }
                    break;

                case 'weekly':
                    if (dateDiff < 7) {
                        isBackupFresh = true;
                    }
                    break;

                case 'monthly':
                    if (dateDiff < 31) {
                        isBackupFresh = true;
                    }
                    break;

                default:
                    break;
            }

            if (isBackupFresh) {
                this.setState({
                    status: 'success',
                    statusMsg: Webiny.I18n('Backup up to date')
                });
            } else {
                this.setState({
                    status: 'warning',
                    statusMsg: Webiny.I18n('Backup not refreshed')
                });
            }

            this.setState({
                backupDetails: backup
            });
        });
    }
}

BackupBox.defaultProps = {
    renderer() {
        return (
            <Webiny.Ui.LazyLoad modules={['ViewSwitcher', 'Tile', 'Button', 'Icon', 'Alert']}>
                {(Ui) => (
                    <Ui.ViewSwitcher>
                        <Ui.ViewSwitcher.View view="backupBoxView" defaultView>
                            {({showView}) => (
                                <view>
                                    <Ui.Tile>
                                        <Ui.Tile.Header title={this.props.backup + ' backup'}/>
                                        <Ui.Tile.Body className="text-center">
                                            <Ui.Icon icon="fa fa-archive" size="4x" type={this.state.status}/>
                                            <hr/>
                                            <Ui.Alert type={this.state.status}>{this.state.statusMsg}</Ui.Alert>
                                            <hr/>
                                            <Ui.Button onClick={showView('backupDetailsModalView')}>{this.i18n('View details')}</Ui.Button>
                                        </Ui.Tile.Body>
                                    </Ui.Tile>
                                </view>
                            )}
                        </Ui.ViewSwitcher.View>
                        <Ui.ViewSwitcher.View view="backupDetailsModalView" modal>
                            {({showView, data: {data: data}}) => <BackupDetailsModal {...{showView, data}} backup={this.state}/>}
                        </Ui.ViewSwitcher.View>
                    </Ui.ViewSwitcher>
                )}
            </Webiny.Ui.LazyLoad>

        );
    }
};

export default BackupBox;