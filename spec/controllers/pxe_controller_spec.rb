require "spec_helper"

describe PxeController do
  before(:each) do
    set_user_privileges
  end

  describe 'x_button' do
    describe 'corresponding methods are called for allowed actions' do
      PxeController::PXE_X_BUTTON_ALLOWED_ACTIONS.each_pair do |action_name, method|
        it "calls the appropriate method: '#{method}' for action '#{action_name}'" do
          controller.should_receive(method)
          get :x_button, :pressed => action_name
        end
      end
    end

    it 'exception is raised for unknown action' do
      get :x_button, :pressed => 'random_dude', :format => :html
      expect { response }.to render_template('layouts/exception')
    end

    it "Pressing Refresh button should show display name in the flash message" do
      pxe = FactoryGirl.create(:pxe_server)
      MiqServer.stub(:my_zone).and_return("default")
      controller.instance_variable_set(:@_params, :id => pxe.id)
      controller.instance_variable_set(:@sb,
                                       :trees       => {
                                         :pxe_tree => {:active_node => "ps-#{pxe.id}"}
                                       },
                                       :active_tree => :pxe_tree
                                      )
      controller.stub(:get_node_info)
      controller.stub(:replace_right_cell)
      controller.send(:pxe_server_refresh)
      assigns(:flash_array).first[:message].should include("Refresh Relationships successfully initiated")
    end
  end

  context "#restore_password" do
    it "populates the password from the pxe record if params[:restore_password] exists" do
      ps = PxeServer.create
      ps.stub(:authentication_password).with(:default).and_return("default_password")
      edit = {:pxe_id => ps.id, :new => {}}
      controller.instance_variable_set(:@edit, edit)
      controller.instance_variable_set(:@ps, ps)
      controller.instance_variable_set(:@_params,
                                       :restore_password => "true",
                                       :log_password     => "[FILTERED]",
                                       :log_verify       => "[FILTERED]")
      controller.send(:restore_password)
      assigns(:edit)[:new][:log_password].should == ps.authentication_password(:default)
    end
  end
end
