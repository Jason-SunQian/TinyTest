/**
 * Copyright (c) 2023 - present TinyEngine Authors.
 * Copyright (c) 2023 - present Huawei Cloud Computing Technologies Co., Ltd.
 *
 * Use of this source code is governed by an MIT-style license.
 *
 * THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,
 * BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR
 * A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.
 *
 */

/* metaService: engine.service.dataSource.useDataSource */
import { reactive } from 'vue';
import { utils } from '@opentiny/tiny-engine-utils';
import { isEqual } from '@opentiny/vue-renderless/common/object';
import { isEmptyObject } from '@opentiny/vue-renderless/common/type';
import { useModal } from '@opentiny/tiny-engine-meta-register';

import { useDesignerI18n } from '@/services/i18nService';

const dataSourceState = reactive({
    dataSource: {},
    record: {},
    recordCopies: {},
    dataSourceColumn: {},
    dataSourceColumnCopies: {},
    remoteData: {},
    remoteDataCopies: {},
    currentRecordId: '',
    isRecordValidate: true,
    disCard: false,
    remoteConfig: {}
});

const compareData = () => {
    let isRecordSame = true;
    let isDataSourceSame = false;

    if (
        !isEmptyObject(dataSourceState.record) &&
        !isEmptyObject(dataSourceState.recordCopies)
    ) {
        isRecordSame = isEqual(
            dataSourceState.record,
            dataSourceState.recordCopies
        );
    }

    isDataSourceSame = isEqual(
        dataSourceState.dataSourceColumn,
        dataSourceState.dataSourceColumnCopies
    );

    const isRemoteDataSame = isEqual(
        dataSourceState.remoteData,
        dataSourceState.remoteDataCopies
    );

    return { isRecordSame, isDataSourceSame, isRemoteDataSame };
};

interface DataSourceState {
     
    dataSource: Record<string, any>;
     
    record: Record<string, any>;
     
    recordCopies: Record<string, any>;
     
    dataSourceColumn: Record<string, any>;
     
    dataSourceColumnCopies: Record<string, any>;
     
    remoteData: Record<string, any>;
     
    remoteDataCopies: Record<string, any>;
    currentRecordId: string;
    isRecordValidate: boolean;
    disCard: boolean;
     
    remoteConfig: Record<string, any>;
}

const handleConfirmSave = (
    localDataSourceState: DataSourceState,
    isRecordSame: boolean,
    resolve: (value: unknown) => void,
    isDataSourceSame: boolean,
     
    callback: (...args: any[]) => any
     
) => {
    let {
        name,
        data: { data: dataValue, columns }
    } = localDataSourceState.dataSource;

    if (!isRecordSame) {
        // 必填字段没数据不记录该条数据
        if (!localDataSourceState.isRecordValidate) {
            localDataSourceState.record = {};
            localDataSourceState.recordCopies = {};
            localDataSourceState.isRecordValidate = true;
            resolve(true);
            return;
        }

        // 数据源数据修改，新增，数据源数据做修改
        if (localDataSourceState.currentRecordId) {
            dataValue = dataValue || [];
            const index = dataValue.findIndex(
                (item: { id: string }) =>
                    item.id === localDataSourceState.currentRecordId
            );

            dataValue[index] = Object.assign(
                dataValue[index],
                localDataSourceState.record
            );
        } else {
            const record = { ...localDataSourceState.record, id: utils.guid() };
            dataValue = [...dataValue, record];
        }
    }

    if (!isDataSourceSame) {
        // 数据源名称，类型，字段改变，数据源修改
        columns = localDataSourceState.dataSourceColumn?.columns;
        name = localDataSourceState.dataSourceColumn?.name;
    }

    const {
        id,
        data: { type }
    } = localDataSourceState.dataSource;

    const requestData = { name, data: { columns, data: dataValue, type } };

     
    callback(id, requestData).then((responseData: any) => {
        if (responseData) {
            localDataSourceState.record = {};
            localDataSourceState.recordCopies = {};
            localDataSourceState.currentRecordId = '';
            localDataSourceState.dataSourceColumn = {};
            localDataSourceState.dataSourceColumnCopies = {};
            localDataSourceState.dataSource = {};
            resolve(true);
        }
    });

    return undefined;
};

 
const saveDataSource = (callback: (...args: any[]) => any) => {
    const { isRecordSame, isDataSourceSame } = compareData();
    const { confirm } = useModal();
    const { t } = useDesignerI18n();

    if (
        !isEmptyObject(dataSourceState.dataSource) &&
        (!isRecordSame || !isDataSourceSame)
    ) {
        return new Promise(resolve => {
            confirm({
                title: t('designer.datasource.tip'),
                message: dataSourceState.isRecordValidate
                    ? t('designer.datasource.dataNotSaved')
                    : t('designer.datasource.requiredFieldEmpty'),
                exec: () => {
                    handleConfirmSave(
                        dataSourceState,
                        isRecordSame,
                        resolve,
                        isDataSourceSame,
                        callback
                    );
                }
            });
        });
    }

    return Promise.resolve(false);
};

export default () => {
    return { dataSourceState, compareData, saveDataSource };
};
