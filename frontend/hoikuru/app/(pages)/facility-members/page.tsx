import FacilityMemberAdd from "./facility-member-add";
import FacilityMembersData from "./facility-members-data";

export default function FacilityAdmins () {
    return (
        <>
                 <div className="">
        <div className="m-8 w-full">
          <FacilityMemberAdd />
          <FacilityMembersData />
        </div>
      </div>
        </>
    );
}