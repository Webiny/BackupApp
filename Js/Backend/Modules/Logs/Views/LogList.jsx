import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import LogDetails from './LogDetails';

class LogList extends Webiny.Ui.View {

}

LogList.defaultProps = {

    renderer() {
        const listProps = {
            api: '/entities/backup-app/log',
            query: {'_sort': '-createdOn'},
            fields: '*,backupsCreated',
            layout: null
        };

        return (
            <webiny-backup-app>
                <Ui.View.List>
                    <Ui.View.Header title="Backup logs"/>

                    <Ui.View.Body>
                        <Ui.Grid.Row>
                            <Ui.Grid.Col all={12}>
                                <Ui.Form.Fieldset title="Latest backup"/>

                                

                            </Ui.Grid.Col>
                        </Ui.Grid.Row>
                    </Ui.View.Body>
                </Ui.View.List>

                <Ui.View.List>
                    <Ui.View.Body>
                        <Ui.List.ApiContainer {...listProps}>
                            {(backupLogs, meta, list) => {
                                return (
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Form.Fieldset
                                                title={`Backup logs: ${meta.totalCount} records (showing ${meta.perPage} per page)`}/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.List.Loader/>
                                            <Ui.List.Table.Empty renderIf={!backupLogs.length}/>

                                            <Ui.ExpandableList>
                                                {backupLogs.map(row => {
                                                    return (
                                                        <Ui.ExpandableList.Row key={row.id}>
                                                            <Ui.ExpandableList.Field all={3} name="Successful" className="text-center">
                                                                {() => {
                                                                    if (row.successful) {
                                                                        return <span className="badge badge-success">Yes</span>;
                                                                    } else {
                                                                        return <span className="badge badge-danger">No</span>;
                                                                    }
                                                                }}
                                                            </Ui.ExpandableList.Field>
                                                            <Ui.ExpandableList.Field all={3} name="Date">
                                                                <Ui.Filters.DateTime value={row.createdOn}/>
                                                            </Ui.ExpandableList.Field>
                                                            <Ui.ExpandableList.Field all={3} name="Execution time">
                                                                {row.executionTime}
                                                            </Ui.ExpandableList.Field>
                                                            <Ui.ExpandableList.Field all={3} name="Backups created" className="text-center">
                                                                {() => {
                                                                    return _.size(row.backupsCreated);
                                                                }}
                                                            </Ui.ExpandableList.Field>

                                                            <Ui.ExpandableList.RowDetailsList title={'Backup ' + row.createdOn}>
                                                                <LogDetails log={row.id}/>
                                                            </Ui.ExpandableList.RowDetailsList>

                                                        </Ui.ExpandableList.Row>
                                                    );
                                                })}
                                            </Ui.ExpandableList>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.List.Pagination/>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>
                                );
                            }}
                        </Ui.List.ApiContainer>
                    </Ui.View.Body>
                </Ui.View.List>
            </webiny-backup-app>
        );
    }
};

export default LogList;