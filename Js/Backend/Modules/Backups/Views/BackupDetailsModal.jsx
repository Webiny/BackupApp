import React from 'react';
import Webiny from 'webiny';

/**
 * @i18n.namespace BackupApp.Backend.Backups.BackupDetailsModal
 */
class BackupDetailsModal extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);
    }

    getBackupDetails(backup) {
        const {Filters} = this.props;
        let backupDetails = '';

        if (backup.status === 'danger') {
            backupDetails = (<p>
                <small>
                    {this.i18n(`Your backup was not created for the given slot. Note that certain backups are created only at specific
                    times.
                    For example a weekly backup is created each Saturday and each monthly backup is created at the last day of
                    each month.
                    If that period hasn't happened since you activated your backup cron job, that is the reason why your backup
                    doesn't exist.
                    If you still think that your backup should have been created - please check the log and your settings for
                    any errors.`)}
                </small>
            </p>);
        } else {
            let encrypted = 'NO';
            if (backup.backupDetails.encrypted) {
                encrypted = 'YES';
            }

            let backupMsg = '';
            if (backup.status === 'warning') {
                backupMsg = (
                    <p>
                        <small>
                            {this.i18n(`Note that this backup was expected to refresh on one of the last backup cron job runs,
                                        but that didn't happen and the current backup is out of date.`)}
                            <br/>
                            {this.i18n('Please check your backup log for any errors.')}
                        </small>
                    </p>
                );
            }

            backupDetails = (
                <div>
                    {backupMsg}
                    <dl className="dl-horizontal">
                        <dt>{this.i18n('Date created')}</dt>
                        <dd><Filters.DateTime value={backup.backupDetails.dateCreated}/></dd>

                        <dt>{this.i18n('Filename')}</dt>
                        <dd>{backup.backupDetails.filename}</dd>

                        <dt>{this.i18n('Size')}</dt>
                        <dd><Filters.FileSize value={backup.backupDetails.size}/></dd>

                        <dt>{this.i18n('Encrypted')}</dt>
                        <dd>{encrypted}</dd>
                    </dl>
                </div>
            );
        }

        return backupDetails;
    }

    renderDialog() {
        const {Modal, Alert, Button} = this.props;
        return (
            <Modal.Dialog>
                <Modal.Content>
                    <Modal.Header title={this.i18n('Backup Details')}/>
                    <Modal.Body>
                        <Alert type={this.props.backup.status}>{this.props.backup.statusMsg}</Alert>
                        {this.getBackupDetails(this.props.backup)}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button label={this.i18n('Close')} onClick={this.hide}/>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(BackupDetailsModal, {modules: ['Modal', 'Alert', 'Button', 'Filters']});