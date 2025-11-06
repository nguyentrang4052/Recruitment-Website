package vn.iotstar.key;

import java.io.Serializable;
import java.util.Objects;

public class ApplicantSkillID implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private int applicant;

	private int skill;

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (!(o instanceof ApplicantSkillID))
			return false;
		ApplicantSkillID that = (ApplicantSkillID) o;
		return applicant == that.applicant && skill == that.skill;
	}

	@Override
	public int hashCode() {
		return Objects.hash(applicant, skill);
	}

}
