import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { actions } from "mirrorx";
import queryString from 'query-string';
import { Switch, InputNumber,Loading, Table, Button, Col, Row, Icon, InputGroup, FormControl, Checkbox, Modal, Panel, PanelGroup, Label, Message, Radio } from "tinper-bee";
import AcUpload from 'ac-upload';
import Header from "components/Header";
import options from "components/RefOption";
import DatePicker from 'bee-datepicker';
import Form from 'bee-form';
import Select from 'bee-select';
import RefWithInput from 'yyuap-ref/dist2/refWithInput'
import moment from "moment";
import 'yyuap-ref/dist2/yyuap-ref.css'//参照样式
import './edit.less';
import 'ac-upload/build/ac-upload.css';

const FormItem = Form.FormItem;
const Option = Select.Option;

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowData: {},
                orderType: '',
                isPaid: 0,
                orderNo: '',
                    refKeyArraypurOrg:[],
                releaseTime: '',
                orderAmount: '',
                    refKeyArrayapplyNo:[],
                purGroupNo: '',
                purOrgSrc: '',
                confirmTime: '',
                applyName: '',
                orderState: '',
            fileNameData: props.rowData.attachment || [],//上传附件数据
            selValue:""
        }
    }
    async componentWillMount() {
        if (this.props.rowData && this.props.rowData.id) {
            let { approvalState, closeState, confirmState } = this.props.rowData;
            this.setState({
                approvalState: String(approvalState),
                closeState: String(closeState),
                confirmState: String(confirmState)
            })
        }
        await actions.OrderInfo.getOrderTypes();
        let searchObj = queryString.parse(this.props.location.search);
        let { btnFlag } = searchObj;
        if (btnFlag && btnFlag > 0) {
            let { search_id } = searchObj;
            let tempRowData = await actions.OrderInfo.queryDetail({ search_id });
            let rowData = {};
            if(tempRowData){
                    let temppurOrg = tempRowData.purOrg
                    let tempapplyNo = tempRowData.applyNo
               this.setState({
                    isPaid:tempRowData.isPaid||0,
                    refKeyArraypurOrg: temppurOrg?[temppurOrg]:[],
                    refKeyArrayapplyNo: tempapplyNo?[tempapplyNo]:[],
               })
               rowData = Object.assign({},tempRowData,
                        {purOrg:tempRowData.purOrgSrc},
                        {applyNo:tempRowData.applyName},
               )
            }
            console.log('rowData',rowData);
            this.setState({
                rowData:rowData,
            })
        }

    }
    save = () => {//保存
        this.props.form.validateFields(async (err, values) => {
            values.attachment = this.state.fileNameData;
                  
            if (err) {
                Message.create({ content: '数据填写错误', color: 'danger' });
            } else {
                let {rowData,

                            isPaid,


                            refKeyArraypurOrg,



                            refKeyArrayapplyNo,






                } = this.state;
                if (rowData && rowData.id) {
                    values.id = rowData.id;
                    values.ts = rowData.ts;
                }
                values.isPaid = isPaid;
                values.purOrg = refKeyArraypurOrg.join();
                values.applyNo = refKeyArrayapplyNo.join();
                values.releaseTime = values.releaseTime.format('YYYY-MM-DD');
                values.confirmTime = values.confirmTime.format('YYYY-MM-DD');
                console.log("save values", values);
                actions.OrderInfo.save(values);
            }
        });
    }

    onBack = async() => {
        window.history.go(-1);
    }

    // 动态显示标题
    onChangeHead = (btnFlag) => {
        let msg = "";
        switch (btnFlag) {
            case 0:
                msg = "新增";
                break;
            case 1:
                msg = "编辑";
                break;
            case 2:
                msg = "详情"
                break;
        }
        return msg;
    }
    //上传成功后的回调
    handlerUploadSuccess = (data) => {
        let searchObj = queryString.parse(this.props.location.search);
        let id = searchObj.search_id;
        if (searchObj.btnFlag == 0) {

        } else if (searchObj.btnFlag == 1) {
            // if (data.length > 0) {
            //     data[0]['id'] = id;
            // }
        }

        this.setState(({ fileNameData }) => {
            //拿到当前原始对象
            let newFileList = [];
            //找到历史数据合并
            newFileList = newFileList.concat(fileNameData);
            //原始数据合并新数据
            newFileList = newFileList.concat(data);
            return {
                fileNameData: newFileList
            };
        });
    }
    //删除文件的回调
    handlerUploadDelete = (file) => {
        this.setState(({ fileNameData }) => {
            for (let i = 0; i < fileNameData.length; i++) {
                if (fileNameData[i].originalFileName == file.name) {
                    fileNameData[i]['del'] = 'del';
                }
            }
            return {
                fileNameData
            }
        });
    }


    arryDeepClone = (array)=>{
        let result = [];
        if(array){
            array.map((item)=>{
                let temp = Object.assign([],item);
                result.push(temp);
            })
        }
    }

    //  下拉框数据改变
    onSelectChange = (value) => {
        alert(value);
    }


    // 通过search_id查询数据

    render() {
        const self = this;

        let { btnFlag } = queryString.parse(this.props.location.search);
        btnFlag = Number(btnFlag);
        let {rowData,
                    refKeyArraypurOrg,
                    refKeyArrayapplyNo,
        } = this.state;


        let title = this.onChangeHead(btnFlag);
        let { orderType,isPaid,orderNo,purOrg,releaseTime,orderAmount,applyNo,purGroupNo,purOrgSrc,confirmTime,applyName,orderState, } = rowData;
        const { getFieldProps, getFieldError } = this.props.form;

        return (
            <div className='OrderInfo-detail'>
                <Loading
                    showBackDrop={true}
                    loadingType="line"
                    show={this.props.showLoading}
                />
                <Header title={title} back={true} backFn={this.onBack}>
                    {(btnFlag < 2) ? (
                        <div className='head-btn'>
                            <Button className='head-cancel' onClick={this.onBack}>取消</Button>
                            <Button className='head-save' onClick={this.save}>保存</Button>
                        </div>
                    ) : ''}
                </Header>
                <Row className='detail-body'>

                            <Col md={4} xs={6}>
                                <Label>
                                    订单类型：
                                </Label>
                                    <Select disabled={btnFlag == 2}
                                        
                                        {
                                        ...getFieldProps('orderType', {
                                            initialValue: orderType || '',
                                            rules: [{
                                                type:'string',required: true, message: '请选择订单类型',
                                            }],
                                            onChange : btnFlag==1 ? self.onSelectChange: ()=>{}
                                        }
                                        )}>
                                        <Option value="">请选择</Option>
                                            <Option value="0">生产订单</Option>
                                            <Option value="1">日常订单</Option>
                                            <Option value="2">临时订单</Option>
                                            <Option value="3">测试订单</Option>
                                    </Select>

                                <span className='error'>
                                    {getFieldError('orderType')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    是否付款：
                                </Label>
                                    <Switch disabled={btnFlag == 2}
                                        checked={this.state.isPaid}
                                        checkedChildren={"on"}
                                        unCheckedChildren={"off"}
                                        {
                                            ...getFieldProps('isPaid', {
                                                initialValue: 1,
                                                onChange(value) {
                                                    self.setState({
                                                        isPaid: self.state.isPaid===0 ? 1 :0
                                                    });
                                                },
                                            })
                                        }
                                    />

                                <span className='error'>
                                    {getFieldError('isPaid')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    编号：
                                </Label>
                                    <FormControl disabled={btnFlag == 2}
                                        {
                                        ...getFieldProps('orderNo', {
                                            validateTrigger: 'onBlur',
                                            initialValue: orderNo || '',
                                            rules: [{
                                                type:'string',required: true, message: '请输入编号',
                                            }],
                                        }
                                        )}
                                    />

                                <span className='error'>
                                    {getFieldError('orderNo')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    采购单位：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={Object.assign(JSON.parse(options),{
                                                  title: '',
                                        refType: 5,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'common_ref',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '5',
                                        },
                                        keyList:refKeyArraypurOrg,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.key)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArraypurOrg: temp,
                                            })
                                        },
                                        showKey:'peoname',
                                        verification:false,//是否进行校验
                                        verKey:'purOrg',//校验字段
                                        verVal:purOrg
                                    })} form={this.props.form}/>

                                <span className='error'>
                                    {getFieldError('purOrg')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label class="datepicker">
                                    发布时间：
                                </Label>
                                <DatePicker className='form-item' disabled={btnFlag == 2}
                                    format="YYYY-MM-DD"
                                    {
                                    ...getFieldProps('releaseTime', {
                                        initialValue: releaseTime?moment(releaseTime):moment(),
                                        validateTrigger: 'onBlur',
                                        rules: [{
                                            required: true, message: '请选择发布时间',
                                        }],
                                    }
                                    )}
                                />

                                <span className='error'>
                                    {getFieldError('releaseTime')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    订单金额：
                                </Label>

                                    <InputNumber
                                        precision={2}
                                        min={0}
                                        className={"input-number"}
                                        disabled={btnFlag == 2}
                                        {
                                            ...getFieldProps('orderAmount', {
                                                    initialValue: orderAmount&&Number(orderAmount).toFixed(2) || '0.00',
                                                    rules: [{type: 'string',pattern: /^(?:(?!0\.00$))[\d\D]*$/ig,message: '请输入数字'}],
                                            })
                                        }
                                    />
                                <span className='error'>
                                    {getFieldError('orderAmount')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    供应商编号：
                                </Label>
                                    <RefWithInput disabled={btnFlag == 2} option={Object.assign(JSON.parse(options),{
                                                  title: '',
                                        refType: 6,//1:树形 2.单表 3.树卡型 4.多选 5.default
                                        className: '',
                                        param: {//url请求参数
                                            refCode: 'bd_common_org',
                                            tenantId: '',
                                            sysId: '',
                                            transmitParam: '6',
                                        },
                                        keyList:refKeyArrayapplyNo,//选中的key
                                        onSave: function (sels) {
                                            console.log(sels);
                                            var temp = sels.map(v => v.key)
                                            console.log("temp",temp);
                                            self.setState({
                                                refKeyArrayapplyNo: temp,
                                            })
                                        },
                                        showKey:'name',
                                        verification:true,//是否进行校验
                                        verKey:'applyNo',//校验字段
                                        verVal:applyNo
                                    })} form={this.props.form}/>

                                <span className='error'>
                                    {getFieldError('applyNo')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    采购组编号：
                                </Label>
                                    <FormControl disabled={btnFlag == 2 || this.state.selValue==2}
                                        {
                                        ...getFieldProps('purGroupNo', {
                                            validateTrigger: 'onBlur',
                                            initialValue: purGroupNo || '',
                                            rules: [{
                                                type:'string',required: true, message: '请输入采购组编号',
                                            }],
                                        }
                                        )}
                                    />

                                <span className='error'>
                                    {getFieldError('purGroupNo')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label class="datepicker">
                                    确认时间：
                                </Label>
                                <DatePicker className='form-item' disabled={btnFlag == 2}
                                    format="YYYY-MM-DD"
                                    {
                                    ...getFieldProps('confirmTime', {
                                        initialValue: confirmTime?moment(confirmTime):moment(),
                                        validateTrigger: 'onBlur',
                                        rules: [{
                                            required: true, message: '请选择确认时间',
                                        }],
                                    }
                                    )}
                                />

                                <span className='error'>
                                    {getFieldError('confirmTime')}
                                </span>
                            </Col>
                            <Col md={4} xs={6}>
                                <Label>
                                    订单状态：
                                </Label>

                                    {
                                        (btnFlag < 2) ?
                                            (<Radio.RadioGroup
                                                disabled={true}
                                                selectedValue={orderState||'0'}
                                                {
                                                ...getFieldProps('orderState', {
                                                    initialValue: orderState||'0',
                                                    validateTrigger: 'onBlur',
                                                    rules: [{
                                                        required: true, message: '请选择订单状态',
                                                    }],
                                                    onChange(value) {
                                                        let tempRow = Object.assign({},rowData,{ orderState: value });
                                                        self.setState({
                                                            rowData:tempRow
                                                        })
                                                    },
                                                }
                                                )}
                                            >
                                                <Radio value="0">交货</Radio>
                                                <Radio value="1">合同</Radio>
                                                <Radio value="2">意向</Radio>
                                            </Radio.RadioGroup>) : (
                                                <FormControl disabled={btnFlag == 2} value={orderState} />
                                            )
                                    }

                                <span className='error'>
                                    {getFieldError('orderState')}
                                </span>
                            </Col>
                        <Col md={4} xs={6}>
                            <Label>
                                附件：
                            </Label>
                            {
                                (btnFlag < 2) ? (<AcUpload
                                    title={"附件上传"}
                                    action={`${GROBAL_HTTP_CTX}/fileMananger/fastDfs/imgUpload`}
                                    multiple={false}
                                    defaultFileList={this.state.fileNameData}
                                    onError={() => console.log('上传报错了')}
                                    onSuccess={this.handlerUploadSuccess}
                                    onDelete={this.handlerUploadDelete}
                                >
                                    <Button colors="info">上传</Button>
                                </AcUpload>) : (
                                        <AcUpload
                                            title={"查看附件"}
                                            action={`${GROBAL_HTTP_CTX}/fileMananger/fastDfs/imgUpload`}
                                            defaultFileList={this.state.fileNameData}
                                            multiple={false}
                                            isView={true}
                                            onError={() => console.log('上传报错了')}
                                            onSuccess={this.handlerUploadSuccess}
                                        >
                                            <Button colors="info">查看</Button>
                                        </AcUpload>
                                    )
                            }
                        </Col>
                </Row>


            </div>
        )
    }
}

export default Form.createForm()(Edit);