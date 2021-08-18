import React, {ChangeEvent, useState} from 'react';
import {Input, InputGroup} from "chums-ducks";

const SearchForm: React.FC = () => {
    const [workOrderNo, setWorkOrderNo] = useState('');
    const [warehouseCode, setWarehouseCode] = useState('');
    const [itemCode, setItemCode] = useState('');
    const [salesOrderNo, setSalesOrderNo] = useState('');

    const onResetFilter = () => {
        setWorkOrderNo('');
        setWarehouseCode('');
        setItemCode('');
        setSalesOrderNo('');
    }
    return (
        <form className="form-inline mb-3 row">
            <div className="col-auto">
                <InputGroup bsSize="sm">
                    <div className="input-group-text">WO #</div>
                    <Input type="text" value={workOrderNo}
                           onChange={(ev: ChangeEvent<HTMLInputElement>) => setWorkOrderNo(ev.target.value)}/>
                </InputGroup>
            </div>
            <div className="col-auto">
                <InputGroup bsSize="sm">
                    <div className="input-group-text">Whse</div>
                    <Input type="text" value={warehouseCode}
                           onChange={(ev: ChangeEvent<HTMLInputElement>) => setWarehouseCode(ev.target.value)}/>
                </InputGroup>
            </div>
            <div className="col-auto">
                <InputGroup bsSize="sm">
                    <div className="input-group-text">Item</div>
                    <Input type="text" value={itemCode}
                           onChange={(ev: ChangeEvent<HTMLInputElement>) => setItemCode(ev.target.value)}/>
                </InputGroup>
            </div>
            <div className="col-auto">
                <InputGroup bsSize="sm">
                    <div className="input-group-text">SO#</div>
                    <Input type="text" value={salesOrderNo}
                           onChange={(ev: ChangeEvent<HTMLInputElement>) => setSalesOrderNo(ev.target.value)}/>
                </InputGroup>
            </div>
            <div className="col-auto">
                <button type="reset" onClick={onResetFilter} className="btn btn-sm mx-1 btn-outline-secondary">Reset
                </button>
            </div>
        </form>
    );
}
export default SearchForm;
